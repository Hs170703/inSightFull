from pymongo import MongoClient
import pandas as pd
import os
import bcrypt
from datetime import datetime

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('MONGO_DB', 'insightfull_db')

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def save_dataframe_to_mongo(collection_name: str, df: pd.DataFrame):
    """
    Save a pandas DataFrame to a MongoDB collection.
    Each row becomes a document.
    """
    records = df.to_dict(orient='records')
    if records:
        db[collection_name].insert_many(records)
    return len(records)

def get_collection(collection_name: str):
    return db[collection_name]

# --- User management for authentication ---
def create_user(username: str, password: str):
    users = db['users']
    if users.find_one({'username': username}):
        return False  # User already exists
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    users.insert_one({'username': username, 'password': hashed})
    return True

def find_user_by_username(username: str):
    return db['users'].find_one({'username': username})

def verify_password(plain_password: str, hashed_password: bytes):
    return bcrypt.checkpw(plain_password.encode(), hashed_password)

# --- File management for users ---
def save_user_file(username: str, filename: str, file_data: dict):
    """
    Save file information for a specific user
    """
    # Check if file already exists for this user
    existing_file = db['user_files'].find_one({
        'username': username,
        'filename': filename
    })
    
    if existing_file:
        # Update existing file instead of creating duplicate
        db['user_files'].update_one(
            {'username': username, 'filename': filename},
            {
                '$set': {
                    'file_data': file_data,
                    'uploaded_at': datetime.utcnow()
                }
            }
        )
        print(f"Updated existing file for {username}, {filename}")
        return False  # Indicates file was updated, not created
    else:
        # Create new file entry
        db['user_files'].insert_one({
            'username': username,
            'filename': filename,
            'file_data': file_data,
            'uploaded_at': datetime.utcnow()
        })
        print(f"Created new file for {username}, {filename}")
        return True  # Indicates new file was created

def get_user_files(username: str):
    """
    Get all files uploaded by a specific user
    """
    return list(db['user_files'].find({'username': username}))

def get_user_file(username: str, filename: str):
    """
    Get a specific file for a user
    """
    return db['user_files'].find_one({'username': username, 'filename': filename})

# --- Regression results management ---
def save_regression_result(username: str, filename: str, result: dict, model_type: str = "linear_regression"):
    # Check if result already exists for this user, filename, model type, and target column
    existing_result = db['regression_results'].find_one({
        'username': username,
        'filename': filename,
        'model_type': model_type,
        'result.target_column': result.get('target_column')
    })
    
    if existing_result:
        # Update existing result instead of creating duplicate
        db['regression_results'].update_one(
            {
                'username': username,
                'filename': filename,
                'model_type': model_type,
                'result.target_column': result.get('target_column')
            },
            {
                '$set': {
                    'result': result,
                    'timestamp': datetime.utcnow()
                }
            }
        )
        print(f"Updated existing result for {username}, {filename}, {model_type}, {result.get('target_column')}")
        return False  # Indicates result was updated, not created
    else:
        # Create new result entry
        db['regression_results'].insert_one({
            'username': username,
            'filename': filename,
            'model_type': model_type,
            'result': result,
            'timestamp': datetime.utcnow()
        })
        print(f"Created new result for {username}, {filename}, {model_type}, {result.get('target_column')}")
        return True  # Indicates new result was created

def get_user_results(username: str):
    return list(db['regression_results'].find({'username': username}))

def get_user_result_by_id(username: str, result_id: str):
    """
    Get a specific result by ID for a user
    """
    from bson import ObjectId
    return db['regression_results'].find_one({
        'username': username,
        '_id': ObjectId(result_id)
    })