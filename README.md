# inSightFull - Smart Data Analyzer

A comprehensive machine learning application that provides automated data analysis and linear regression predictions with interactive visualizations, user authentication, and persistent file storage.

## 🚀 New Features

- **🔐 User Authentication**: Secure JWT-based login system
- **📁 File Management**: Persistent storage of uploaded files per user
- **📊 Results History**: Complete history of all analysis results
- **🧭 Multi-Page Navigation**: Separate pages for Home, Results, and Files
- **📈 Detailed Results**: Individual result pages with comprehensive analysis
- **💾 Data Persistence**: All files and results saved to MongoDB database

## ✨ Core Features

- **CSV File Upload**: Upload and analyze CSV datasets with drag-and-drop
- **Automated Analysis**: Get instant insights about your data
- **Linear Regression**: Predict target variables with machine learning
- **Interactive Visualizations**: View correlation heatmaps, prediction plots, and distributions
- **Feature Importance**: Understand which variables most influence predictions
- **Model Metrics**: R² score, RMSE, and MSE for model evaluation
- **User-Specific Data**: Each user's files and results are isolated and secure

## 🏗️ Architecture

- **Backend**: FastAPI with scikit-learn for ML processing and JWT authentication
- **Frontend**: React with React Router for multi-page navigation
- **Database**: MongoDB for persistent data storage
- **Containerized**: Docker setup for easy deployment

## 🛠️ Quick Start with Docker

### Prerequisites

- Docker
- Docker Compose
- MongoDB (included in docker-compose)

### Running the Application

1. **Clone and navigate to the project**:
   ```bash
   cd inSightFull
   ```

2. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: mongodb://localhost:27017

4. **Stop the services**:
   ```bash
   docker-compose down
   ```

## 🧪 Development Setup

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Database Setup

The application uses MongoDB. For local development, you can:
- Use the MongoDB instance in docker-compose
- Or install MongoDB locally and update the connection string

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login (returns JWT token)

### File Management
- `POST /api/upload` - Upload CSV file for analysis (requires auth)
- `GET /api/user/files` - Get user's uploaded files (requires auth)

### Analysis
- `POST /api/predict` - Run linear regression prediction (requires auth)
- `GET /api/user/results` - Get user's analysis results (requires auth)
- `GET /api/user/results/{result_id}` - Get specific result details (requires auth)

### Charts
- `GET /api/chart/{chart_type}` - Retrieve generated charts

## 🗂️ Code Structure

### Frontend Structure
```
frontend/src/
├── components/           # Modular React components
│   ├── Navbar.js        # Navigation bar with auth status
│   ├── Home.js          # Main upload and analysis page
│   ├── Results.js       # Results listing page
│   ├── ResultDetail.js  # Individual result detail page
│   ├── Files.js         # User's uploaded files page
│   └── LoginModal.js    # Authentication modal
├── App.js               # Main app with React Router
└── App.css              # Application styling
```

### Backend Structure
```
backend/
├── main.py              # FastAPI application with all endpoints
└── requirements.txt     # Python dependencies

database/
└── mongo_client.py      # MongoDB operations and user management
```

### Key Components

#### Frontend Components
- **Navbar**: Handles navigation and authentication state
- **Home**: File upload and prediction interface
- **Results**: Displays all user's analysis results in cards
- **ResultDetail**: Shows detailed analysis with charts and metrics
- **Files**: Lists all uploaded files with metadata
- **LoginModal**: Handles user authentication

#### Backend Services
- **Authentication**: JWT token management with bcrypt password hashing
- **File Management**: User-specific file storage and retrieval
- **ML Processing**: Linear regression with scikit-learn
- **Visualization**: Chart generation with matplotlib and seaborn
- **Database**: MongoDB integration for persistent storage

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with username/password
2. **Login**: JWT token issued upon successful authentication
3. **Token Storage**: Frontend stores token in localStorage
4. **API Calls**: All authenticated endpoints require Bearer token
5. **Token Validation**: Backend validates tokens on each request

## 📊 Data Flow

1. **File Upload**: User uploads CSV → Backend processes → MongoDB storage
2. **Analysis**: User selects target → ML model training → Results saved
3. **Results Display**: Results page shows all analyses → Detail page for specifics
4. **File Management**: Files page shows upload history and metadata

## 🐳 Docker Configuration

### Backend Dockerfile
- Python 3.11 slim image
- Installs system dependencies for matplotlib
- Exposes port 8000
- Uses uvicorn for ASGI server

### Frontend Dockerfile
- Multi-stage build with Node.js 18 and nginx
- Builds React app and serves with nginx
- Proxies API requests to backend
- Exposes port 80 (mapped to 3000)

### Docker Compose
- Orchestrates frontend, backend, and MongoDB services
- Creates internal network for service communication
- Maps ports for external access
- Includes MongoDB for data persistence

## 🎯 Usage Guide

### For New Users
1. **Register/Login**: Create an account or login to existing account
2. **Upload Data**: Drag and drop a CSV file on the home page
3. **Select Target**: Choose the column you want to predict
4. **Get Results**: View model performance and visualizations
5. **Access History**: Use the Results and Files pages to view past analyses

### For Returning Users
1. **Login**: Access your account
2. **View History**: Check Results page for past analyses
3. **Re-analyze**: Use Files page to re-analyze previous uploads
4. **Compare Results**: Navigate between different analysis results

## 📁 Supported File Types

- CSV files only (for now)
- Numeric columns for features
- Any column as target variable
- Maximum file size: 10MB (configurable)

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **User Isolation**: Each user's data is completely isolated
- **Input Validation**: File type and size validation
- **CORS Protection**: Configured for secure cross-origin requests

## 🔧 Technical Stack

### Backend
- FastAPI (Python web framework)
- scikit-learn (Machine learning)
- pandas (Data manipulation)
- matplotlib & seaborn (Visualization)
- numpy (Numerical computing)
- PyMongo (MongoDB driver)
- python-jose (JWT handling)
- bcrypt (Password hashing)

### Frontend
- React 19 (UI framework)
- React Router (Navigation)
- Modern CSS (Styling)
- Fetch API (HTTP requests)
- localStorage (Token persistence)

### Database
- MongoDB (NoSQL database)
- Flexible schema for various data types
- Indexed collections for performance

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, and 27017 are available
2. **Build errors**: Check Docker and Docker Compose versions
3. **API connection**: Verify nginx proxy configuration
4. **Database connection**: Check MongoDB service status
5. **Authentication errors**: Clear localStorage and re-login

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Environment Variables

Create a `.env` file for custom configuration:
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=insightfull_db
JWT_SECRET=your-secret-key
```

## 🚀 Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use `.env` files for configuration
2. **SSL/TLS**: Add HTTPS with reverse proxy
3. **Database**: Use managed MongoDB service (Atlas, etc.)
4. **Monitoring**: Add health checks and logging
5. **Scaling**: Use Docker Swarm or Kubernetes
6. **Backup**: Implement database backup strategy
7. **Security**: Use strong JWT secrets and HTTPS

## 📈 Performance Considerations

- **File Size Limits**: Configure appropriate upload limits
- **Database Indexing**: Index frequently queried fields
- **Caching**: Consider Redis for session management
- **CDN**: Use CDN for static assets in production
- **Load Balancing**: Scale horizontally for high traffic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the logs for error messages
4. Create an issue on GitHub

---

**inSightFull** - Making data analysis accessible to everyone! 📊✨ 