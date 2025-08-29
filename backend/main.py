from fastapi import FastAPI, File, UploadFile, Query, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Dict
import pandas as pd
import io
import os
import json
import base64
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler, LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import tempfile
from database.mongo_client import (
    save_dataframe_to_mongo, create_user, find_user_by_username, verify_password, 
    save_regression_result, get_user_results, save_user_file, get_user_files,
    get_user_result_by_id
)

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv('JWT_SECRET', 'supersecretkey')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str

class UserInDB(User):
    password: str

# Store uploaded files temporarily (in memory for now)
uploaded_files = {}

class PredictionRequest(BaseModel):
    filename: str
    target_column: str
    model_type: str = "linear_regression"  # Default to linear regression

# --- Auth utility functions ---
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = find_user_by_username(username)
    if user is None:
        raise credentials_exception
    return User(username=username)

# --- Auth endpoints ---
@app.post("/api/register")
def register(form_data: OAuth2PasswordRequestForm = Depends()):
    if not create_user(form_data.username, form_data.password):
        raise HTTPException(status_code=400, detail="Username already registered")
    return {"message": "User registered successfully"}

@app.post("/api/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = find_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user['username']})
    return {"access_token": access_token, "token_type": "bearer"}

# --- File management endpoints ---
@app.get("/api/user/files")
def get_user_files_api(current_user: User = Depends(get_current_user)):
    files = get_user_files(current_user.username)
    # Convert ObjectId and datetime to string for JSON serialization
    for f in files:
        f["_id"] = str(f["_id"])
        if "uploaded_at" in f:
            f["uploaded_at"] = f["uploaded_at"].isoformat()
    return files

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...), 
    save_to_db: bool = Query(False, description="Save file to MongoDB"),
    current_user: User = Depends(get_current_user)
) -> Dict:
    # Only accept CSV for now
    if not file.filename.endswith('.csv'):
        return {"error": "Only CSV files are supported."}
    
    # Read file contents into pandas DataFrame
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
        # Store the DataFrame in memory
        uploaded_files[file.filename] = df
        
        # Save file info to user's account
        file_data = {
            "n_rows": int(df.shape[0]),
            "n_columns": int(df.shape[1]),
            "columns": list(df.columns),
            "null_counts": df.isnull().sum().to_dict(),
            "content_type": file.content_type
        }
        is_new_file = save_user_file(current_user.username, file.filename, file_data)
        
        db_message = None
        if save_to_db:
            count = save_dataframe_to_mongo(file.filename.replace('.csv',''), df)
            db_message = f"Saved {count} records to MongoDB."
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}
    
    summary = {
        "filename": file.filename,
        "content_type": file.content_type,
        "n_rows": int(df.shape[0]),
        "n_columns": int(df.shape[1]),
        "columns": list(df.columns),
        "null_counts": df.isnull().sum().to_dict(),
        "message": "File received and parsed!" + (" (Updated existing file)" if not is_new_file else ""),
        "db_message": db_message,
        "is_new_file": is_new_file
    }
    return summary

@app.post("/api/predict")
async def predict(request: PredictionRequest, current_user: User = Depends(get_current_user)) -> Dict:
    try:
        # Get the stored DataFrame
        if request.filename not in uploaded_files:
            return {"error": "File not found. Please upload the file first."}
        
        df = uploaded_files[request.filename]
        
        # Check if target column exists
        if request.target_column not in df.columns:
            return {"error": f"Target column '{request.target_column}' not found in the dataset."}
        
        # Determine if this is a classification or regression problem
        target_dtype = df[request.target_column].dtype
        target_unique_count = df[request.target_column].nunique()
        target_total_count = len(df[request.target_column])
        
        # Classification if:
        # 1. Object/category dtype, OR
        # 2. Numeric but with few unique values (less than 15 unique values or less than 25% of total rows)
        # 3. But NOT if it's clearly a continuous variable (like Sales, Advertising_Spend)
        is_classification = (
            target_dtype == 'object' or 
            target_dtype.name == 'category' or
            (target_dtype in ['int64', 'float64'] and (
                target_unique_count < 15 or 
                target_unique_count < max(5, target_total_count * 0.25)
            ) and
            # Don't classify if the target name suggests it's a continuous variable
            not any(keyword in request.target_column.lower() for keyword in 
                   ['sales', 'revenue', 'profit', 'amount', 'spend', 'cost', 'price', 'value', 'score', 'rating'])
            )
        )
        
        print(f"Target analysis:")
        print(f"  - Dtype: {target_dtype}")
        print(f"  - Unique values: {target_unique_count}")
        print(f"  - Total samples: {target_total_count}")
        print(f"  - Classification recommended: {is_classification}")
        
        # Provide guidance based on the target column
        if "month" in request.target_column.lower():
            print(f"  - Note: {request.target_column} detected as categorical (months)")
        elif any(keyword in request.target_column.lower() for keyword in ['sales', 'revenue', 'profit', 'amount', 'spend', 'cost', 'price', 'value', 'score', 'rating']):
            print(f"  - Note: {request.target_column} detected as continuous variable")
        elif target_unique_count < 15:
            print(f"  - Note: {request.target_column} has few unique values ({target_unique_count}), consider classification")
        else:
            print(f"  - Note: {request.target_column} has many unique values ({target_unique_count}), consider regression")
        
        # Prepare features
        numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
        if request.target_column in numeric_columns:
            numeric_columns.remove(request.target_column)
        
        if len(numeric_columns) == 0:
            return {"error": "No numeric columns found for features. Need at least one numeric column besides target."}
        
        X = df[numeric_columns]
        y = df[request.target_column]
        
        # Clean the target variable if it's categorical (remove extra spaces)
        if is_classification and target_dtype == 'object':
            y = y.str.strip() if hasattr(y, 'str') else y
            print(f"Cleaned target variable - unique values: {y.unique()}")
        
        # Handle classification vs regression
        y_encoded = None
        y_classes = None
        
        if is_classification:
            # For classification, encode target variable
            le = LabelEncoder()
            y_encoded = le.fit_transform(y)
            y_classes = le.classes_.tolist()
            
            # Check if we have enough samples per class
            unique, counts = np.unique(y_encoded, return_counts=True)
            min_samples_per_class = min(counts)
            
            print(f"Classification detected: {len(y_classes)} classes - {y_classes}")
            print(f"Samples per class: {dict(zip(y_classes, counts))}")
            print(f"Minimum samples per class: {min_samples_per_class}")
            
            # For classification, we need at least 2 samples per class
            # But if we have very few classes (like months), we can be more lenient
            if min_samples_per_class < 2 and len(y_classes) > 5:
                return {"error": f"Not enough samples per class for classification. Minimum samples needed: 2, got: {min_samples_per_class}"}
            elif min_samples_per_class < 1:
                return {"error": f"Not enough samples per class for classification. Minimum samples needed: 1, got: {min_samples_per_class}"}
        else:
            y_encoded = y
            print(f"Regression detected: target range {y.min()} to {y.max()}")
        
        # Split data with stratification for classification
        if is_classification:
            # Check if we can use stratification (need at least 2 samples per class)
            unique, counts = np.unique(y_encoded, return_counts=True)
            min_samples_per_class = min(counts)
            num_classes = len(unique)
            
            # Calculate appropriate test size for small datasets
            if len(X) < 10:
                test_size = max(0.1, 1.0 / len(X))  # At least 1 sample for testing
            else:
                test_size = 0.2
            
            if min_samples_per_class >= 2 and num_classes <= len(X) * test_size:
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y_encoded, test_size=test_size, random_state=42, stratify=y_encoded
                )
                print(f"Used stratified split with test_size={test_size}")
            else:
                # Use regular split if not enough samples for stratification
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y_encoded, test_size=test_size, random_state=42
                )
                print(f"Warning: Using regular split instead of stratified split due to insufficient samples per class")
        else:
            X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
        
        # Scale features for better performance
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Check for potential issues with the data
        print(f"Feature statistics:")
        print(f"X_train shape: {X_train.shape}")
        print(f"y_train range: {y_train.min()} to {y_train.max()}")
        print(f"y_train mean: {y_train.mean():.2f}")
        print(f"y_train std: {y_train.std():.2f}")
        
        # Check for constant target (which would cause issues)
        if y_train.std() == 0:
            return {"error": "Target variable has no variance (all values are the same). Cannot perform regression."}
        
        # Train model based on type
        if request.model_type == "linear_regression":
            if is_classification:
                return {"error": "Linear Regression is for regression problems. Use Logistic Regression for classification."}
            
            # Check if target variable is suitable for regression
            if y_train.nunique() < 3:
                return {"error": f"Target variable has only {y_train.nunique()} unique values. Consider using classification instead."}
            
            model = LinearRegression()
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            
            # Calculate regression metrics
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            # Handle negative R² (which indicates very poor fit)
            if r2 < 0:
                print(f"Warning: Negative R² score ({r2:.3f}) indicates very poor model fit")
                # Calculate baseline (mean prediction) for comparison
                baseline_pred = np.full_like(y_test, y_train.mean())
                baseline_mse = mean_squared_error(y_test, baseline_pred)
                print(f"Baseline MSE (mean prediction): {baseline_mse:.3f}")
                print(f"Model MSE: {mse:.3f}")
                
                # If model is worse than baseline, provide a warning
                if mse > baseline_mse:
                    print(f"Model performs worse than baseline prediction")
            
            metrics = {
                "mean_squared_error": float(mse),
                "r2_score": float(r2),
                "rmse": float(np.sqrt(mse))
            }
            
            feature_importance = dict(zip(numeric_columns, model.coef_))
            
        elif request.model_type == "logistic_regression":
            if not is_classification:
                return {"error": "Logistic Regression is for classification problems. Use Linear Regression for regression."}
            
            model = LogisticRegression(random_state=42, max_iter=1000)
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_pred_proba = model.predict_proba(X_test_scaled)
            
            # Calculate classification metrics
            accuracy = accuracy_score(y_test, y_pred)
            classification_rep = classification_report(y_test, y_pred, output_dict=True)
            
            print(f"Logistic Regression - Accuracy: {accuracy}")
            print(f"Unique values in y_test: {np.unique(y_test)}")
            print(f"Unique values in y_pred: {np.unique(y_pred)}")
            
            metrics = {
                "accuracy": float(accuracy),
                "classification_report": classification_rep
            }
            
            feature_importance = dict(zip(numeric_columns, model.coef_[0]))
            
        elif request.model_type == "naive_bayes":
            if not is_classification:
                return {"error": "Naive Bayes is for classification problems. Use Linear Regression for regression."}
            
            model = GaussianNB()
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_pred_proba = model.predict_proba(X_test_scaled)
            
            # Calculate classification metrics
            accuracy = accuracy_score(y_test, y_pred)
            classification_rep = classification_report(y_test, y_pred, output_dict=True)
            
            metrics = {
                "accuracy": float(accuracy),
                "classification_report": classification_rep
            }
            
            # Naive Bayes doesn't have feature importance in the same way
            feature_importance = {col: 0.0 for col in numeric_columns}
            
        else:
            return {"error": f"Unknown model type: {request.model_type}"}
        
        # Generate visualizations
        charts = generate_charts(df, request.target_column, numeric_columns, y_test, y_pred, is_classification)
        
        # Generate model recommendations
        recommendations = []
        
        # Check performance based on model type
        if is_classification:
            accuracy = metrics.get('accuracy', 0)
            if accuracy < 0.5:  # Poor classification performance
                recommendations.append("Consider trying different classification algorithms like Random Forest or SVM")
        else:
            r2 = metrics.get('r2_score', 0)
            if r2 < 0.1:  # Poor regression performance
                recommendations.append("Consider trying non-linear models like Random Forest or Polynomial Regression")
                if y_train.nunique() < 10:
                    recommendations.append("Target has few unique values - consider classification instead")
        
        result = {
            "target_column": request.target_column,
            "feature_columns": numeric_columns,
            "model_type": request.model_type,
            "is_classification": is_classification,
            "metrics": metrics,
            "feature_importance": feature_importance,
            "sample_predictions": {
                "actual": y_test.tolist()[:5],
                "predicted": y_pred.tolist()[:5]
            },
            "charts": charts,
            "recommendations": recommendations
        }
        
        if y_classes:
            result["target_classes"] = y_classes
        
        # Save result for authenticated user
        is_new_result = save_regression_result(current_user.username, request.filename, result, request.model_type)
        result["is_new_result"] = is_new_result
        
        return result
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

def generate_charts(df, target_col, feature_cols, y_test, y_pred, is_classification=False):
    """Generate basic charts and return them as base64 encoded images"""
    charts = {}
    
    try:
        # 1. Correlation heatmap (only for numeric data)
        plt.figure(figsize=(10, 8))
        numeric_cols = df[feature_cols + [target_col]].select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) > 1:
            correlation_matrix = df[numeric_cols].corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
            plt.title('Correlation Heatmap')
            plt.tight_layout()
            
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            correlation_b64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()
            charts["correlation_heatmap"] = f"data:image/png;base64,{correlation_b64}"
        
        # 2. Actual vs Predicted plot
        plt.figure(figsize=(8, 6))
        if is_classification:
            # For classification, show confusion matrix-like visualization
            plt.scatter(range(len(y_test)), y_test, alpha=0.6, label='Actual', s=50)
            plt.scatter(range(len(y_pred)), y_pred, alpha=0.6, label='Predicted', s=50, marker='x')
            plt.xlabel('Sample Index')
            plt.ylabel('Class')
            plt.title('Actual vs Predicted Classes')
            plt.legend()
        else:
            # For regression, show scatter plot
            plt.scatter(y_test, y_pred, alpha=0.6)
            plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
            plt.xlabel('Actual Values')
            plt.ylabel('Predicted Values')
            plt.title('Actual vs Predicted Values')
        plt.tight_layout()
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        scatter_b64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        charts["actual_vs_predicted"] = f"data:image/png;base64,{scatter_b64}"
        
        # 3. Target column distribution
        plt.figure(figsize=(8, 6))
        if is_classification:
            # For classification, show bar chart
            df[target_col].value_counts().plot(kind='bar')
            plt.xlabel(target_col)
            plt.ylabel('Count')
            plt.title(f'Distribution of {target_col}')
            plt.xticks(rotation=45)
        else:
            # For regression, show histogram
            plt.hist(df[target_col], bins=20, alpha=0.7, edgecolor='black')
            plt.xlabel(target_col)
            plt.ylabel('Frequency')
            plt.title(f'Distribution of {target_col}')
        plt.tight_layout()
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        dist_b64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        charts["target_distribution"] = f"data:image/png;base64,{dist_b64}"
        
    except Exception as e:
        charts = {"error": f"Chart generation failed: {str(e)}"}
    
    return charts

@app.get("/api/user/results")
def get_user_results_api(current_user: User = Depends(get_current_user)):
    results = get_user_results(current_user.username)
    # Convert ObjectId and datetime to string for JSON serialization
    for r in results:
        r["_id"] = str(r["_id"])
        if "timestamp" in r:
            r["timestamp"] = r["timestamp"].isoformat()
    return results

@app.get("/api/user/results/{result_id}")
def get_user_result_detail(result_id: str, current_user: User = Depends(get_current_user)):
    result = get_user_result_by_id(current_user.username, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    # Convert ObjectId and datetime to string for JSON serialization
    result["_id"] = str(result["_id"])
    if "timestamp" in result:
        result["timestamp"] = result["timestamp"].isoformat()
    return result

@app.get("/api/chart/{chart_type}")
async def get_chart(chart_type: str):
    """Serve chart images"""
    # This is a simplified version - in production you'd want proper file serving
    return {"message": f"Chart {chart_type} would be served here"} 