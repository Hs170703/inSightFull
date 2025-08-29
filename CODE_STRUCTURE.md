# inSightFull - Code Structure Documentation

This document provides a detailed overview of the codebase structure, architecture patterns, and implementation details for the inSightFull application.

## 📁 Project Overview

inSightFull is a full-stack web application built with React (frontend) and FastAPI (backend), featuring user authentication, file management, and machine learning capabilities.

## 🏗️ Architecture Overview

```
inSightFull/
├── frontend/          # React application
├── backend/           # FastAPI application
├── database/          # Database utilities
├── docker-compose.yml # Container orchestration
├── README.md         # User documentation
├── readme            # Technical documentation
└── CODE_STRUCTURE.md # This file
```

## 🎯 Frontend Architecture

### Technology Stack
- **React 19**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Modern CSS**: Custom styling with CSS Grid and Flexbox
- **Fetch API**: HTTP requests to backend
- **localStorage**: Token persistence

### Component Structure

```
frontend/src/
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation and authentication
│   ├── Home.js          # Main upload interface
│   ├── Results.js       # Results listing
│   ├── ResultDetail.js  # Individual result view
│   ├── Files.js         # File management
│   └── LoginModal.js    # Authentication modal
├── App.js               # Main application component
├── App.css              # Global styles
├── index.js             # Application entry point
└── index.css            # Base styles
```

### Component Details

#### 1. App.js (Main Application)
**Purpose**: Application root with routing and state management
**Key Features**:
- React Router setup with protected routes
- Authentication state management
- Token persistence with localStorage
- Global error handling

**Key Functions**:
```javascript
// Authentication state management
const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser'));

// Token persistence
useEffect(() => {
  if (authToken) {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('loggedInUser', loggedInUser);
  } else {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
  }
}, [authToken, loggedInUser]);
```

#### 2. Navbar.js (Navigation Component)
**Purpose**: Top navigation bar with authentication status
**Key Features**:
- Responsive navigation menu
- Authentication status display
- Active route highlighting
- Mobile hamburger menu

**Key Functions**:
```javascript
// Active route detection
const location = useLocation();
const isActive = location.pathname === item.path;

// Mobile menu toggle
const [menuOpen, setMenuOpen] = useState(false);
```

#### 3. Home.js (Main Interface)
**Purpose**: File upload and analysis interface
**Key Features**:
- Drag-and-drop file upload
- File preview functionality
- Target column selection
- Prediction triggering

**Key Functions**:
```javascript
// File upload handling
const uploadToBackend = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // API call with authentication
};

// Prediction execution
const handlePredict = async () => {
  // Navigate to results after successful prediction
  navigate('/results');
};
```

#### 4. Results.js (Results Listing)
**Purpose**: Display all user's analysis results
**Key Features**:
- Grid layout of result cards
- Result metadata display
- Navigation to detail pages
- Empty state handling

**Key Functions**:
```javascript
// Fetch user results
const fetchResults = async () => {
  const response = await fetch('/api/user/results', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// Result card rendering with metrics
const renderResultCard = (result) => {
  // Display R² score, RMSE, feature importance
};
```

#### 5. ResultDetail.js (Detailed Result View)
**Purpose**: Comprehensive view of individual analysis results
**Key Features**:
- Complete metrics display
- Interactive charts
- Feature importance visualization
- Sample predictions table

**Key Functions**:
```javascript
// Fetch specific result
const fetchResultDetail = async () => {
  const response = await fetch(`/api/user/results/${resultId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// Chart rendering
const renderCharts = (charts) => {
  // Display correlation heatmap, scatter plots, distributions
};
```

#### 6. Files.js (File Management)
**Purpose**: Display user's uploaded files
**Key Features**:
- File metadata display
- Upload history
- File statistics
- Re-analysis links

**Key Functions**:
```javascript
// Fetch user files
const fetchFiles = async () => {
  const response = await fetch('/api/user/files', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// File statistics display
const renderFileStats = (file) => {
  // Show rows, columns, null values
};
```

#### 7. LoginModal.js (Authentication)
**Purpose**: User authentication interface
**Key Features**:
- Login form
- Error handling
- Token management
- Modal overlay

**Key Functions**:
```javascript
// Login handling
const handleLogin = async (e) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: loginUsername,
      password: loginPassword,
    }),
  });
};
```

### State Management Pattern

The application uses React's built-in state management with the following patterns:

1. **Local State**: Component-specific state with useState
2. **Props Drilling**: Passing state down through component hierarchy
3. **localStorage**: Persistent authentication state
4. **URL State**: Route parameters for result IDs

### Routing Structure

```javascript
<Routes>
  <Route path="/" element={<Home authToken={authToken} loggedInUser={loggedInUser} />} />
  <Route path="/results" element={authToken ? <Results authToken={authToken} /> : <Navigate to="/" />} />
  <Route path="/results/:resultId" element={authToken ? <ResultDetail authToken={authToken} /> : <Navigate to="/" />} />
  <Route path="/files" element={authToken ? <Files authToken={authToken} /> : <Navigate to="/" />} />
</Routes>
```

## 🔧 Backend Architecture

### Technology Stack
- **FastAPI**: Modern Python web framework
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **matplotlib/seaborn**: Data visualization
- **PyMongo**: MongoDB driver
- **python-jose**: JWT handling
- **bcrypt**: Password hashing

### File Structure

```
backend/
├── main.py              # FastAPI application
└── requirements.txt     # Python dependencies

database/
└── mongo_client.py      # Database operations
```

### API Structure

#### 1. main.py (FastAPI Application)
**Purpose**: Main application with all endpoints
**Key Features**:
- JWT authentication
- File upload handling
- ML model training
- Chart generation
- User management

**Key Endpoints**:

```python
# Authentication
@app.post("/api/register")
@app.post("/api/login")

# File Management
@app.post("/api/upload")
@app.get("/api/user/files")

# Analysis
@app.post("/api/predict")
@app.get("/api/user/results")
@app.get("/api/user/results/{result_id}")

# Charts
@app.get("/api/chart/{chart_type}")
```

**Key Functions**:

```python
# JWT token creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# User authentication
def get_current_user(token: str = Depends(oauth2_scheme)):
    # JWT token validation and user lookup

# File upload with user association
@app.post("/api/upload")
async def upload_file(file: UploadFile, current_user: User = Depends(get_current_user)):
    # Process file and save to user's account

# ML prediction with result storage
@app.post("/api/predict")
async def predict(request: PredictionRequest, current_user: User = Depends(get_current_user)):
    # Train model, generate charts, save results
```

#### 2. database/mongo_client.py (Database Operations)
**Purpose**: MongoDB operations and user management
**Key Features**:
- User authentication
- File storage
- Result persistence
- Data serialization

**Key Functions**:

```python
# User management
def create_user(username: str, password: str):
    # Hash password and create user

def find_user_by_username(username: str):
    # Find user by username

def verify_password(plain_password: str, hashed_password: bytes):
    # Verify password with bcrypt

# File management
def save_user_file(username: str, filename: str, file_data: dict):
    # Save file metadata to user's account

def get_user_files(username: str):
    # Retrieve user's uploaded files

# Result management
def save_regression_result(username: str, filename: str, result: dict):
    # Save analysis results

def get_user_results(username: str):
    # Retrieve user's analysis results
```

### Authentication Flow

1. **Registration**: User creates account → Password hashed → User saved to DB
2. **Login**: User provides credentials → Password verified → JWT token issued
3. **API Access**: Token included in requests → Token validated → User context available
4. **Data Isolation**: All operations filtered by authenticated user

### ML Pipeline

1. **Data Loading**: CSV file parsed with pandas
2. **Preprocessing**: Numeric columns identified, target column validated
3. **Model Training**: Linear regression with scikit-learn
4. **Evaluation**: R² score, RMSE, MSE calculated
5. **Visualization**: Charts generated with matplotlib/seaborn
6. **Storage**: Results saved to MongoDB with user association

## 🗄️ Database Schema

### Collections

#### 1. users
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed)
}
```

#### 2. user_files
```javascript
{
  _id: ObjectId,
  username: String,
  filename: String,
  file_data: {
    n_rows: Number,
    n_columns: Number,
    columns: Array,
    null_counts: Object,
    content_type: String
  },
  uploaded_at: Date
}
```

#### 3. regression_results
```javascript
{
  _id: ObjectId,
  username: String,
  filename: String,
  result: {
    target_column: String,
    feature_columns: Array,
    metrics: {
      mean_squared_error: Number,
      r2_score: Number,
      rmse: Number
    },
    feature_importance: Object,
    sample_predictions: {
      actual: Array,
      predicted: Array
    },
    charts: Object
  },
  timestamp: Date
}
```

## 🔐 Security Implementation

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for password storage
- **Token Expiration**: Configurable token lifetime
- **User Isolation**: Complete data separation between users

### Data Security
- **Input Validation**: File type and size validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Secure error messages without information leakage
- **Database Security**: User-specific data filtering

## 🚀 Performance Considerations

### Frontend Performance
- **Component Optimization**: Efficient re-rendering with React hooks
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Base64 encoded charts for fast loading
- **State Management**: Minimal state updates

### Backend Performance
- **Async Operations**: Non-blocking I/O with FastAPI
- **Database Indexing**: Indexed collections for fast queries
- **File Processing**: Efficient pandas operations
- **Memory Management**: Proper cleanup of temporary data

### Database Performance
- **Indexing Strategy**: Index on username and timestamp fields
- **Query Optimization**: Efficient aggregation pipelines
- **Connection Pooling**: Optimized MongoDB connections
- **Data Serialization**: Efficient JSON handling

## 🧪 Testing Strategy

### Frontend Testing
- **Component Testing**: Unit tests for individual components
- **Integration Testing**: Route and navigation testing
- **User Flow Testing**: End-to-end user journey testing
- **Error Handling**: Error state and recovery testing

### Backend Testing
- **API Testing**: Endpoint functionality testing
- **Authentication Testing**: JWT token validation testing
- **ML Testing**: Model accuracy and performance testing
- **Database Testing**: Data persistence and retrieval testing

## 🔄 Deployment Architecture

### Docker Configuration
- **Multi-stage Builds**: Optimized container images
- **Service Orchestration**: Docker Compose for local development
- **Environment Variables**: Configurable application settings
- **Health Checks**: Service availability monitoring

### Production Considerations
- **Load Balancing**: Horizontal scaling capabilities
- **Database Scaling**: MongoDB replica sets
- **Caching Strategy**: Redis for session management
- **Monitoring**: Application and infrastructure monitoring

## 📈 Scalability Patterns

### Horizontal Scaling
- **Stateless Backend**: FastAPI instances can be scaled horizontally
- **Database Sharding**: MongoDB sharding for large datasets
- **CDN Integration**: Static asset delivery optimization
- **Load Balancing**: Traffic distribution across instances

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Optimization**: Query optimization and indexing
- **Caching Layers**: Redis for frequently accessed data
- **Connection Pooling**: Optimized database connections

## 🔧 Development Workflow

### Code Organization
- **Modular Components**: Reusable React components
- **Service Layer**: Separated business logic
- **Utility Functions**: Shared helper functions
- **Configuration Management**: Environment-based settings

### Development Practices
- **Code Documentation**: Comprehensive inline documentation
- **Error Handling**: Consistent error handling patterns
- **Logging**: Structured logging for debugging
- **Code Review**: Peer review process for quality assurance

---

This code structure documentation provides a comprehensive overview of the inSightFull application architecture, implementation patterns, and development practices. For specific implementation details, refer to the individual component files and API documentation.
