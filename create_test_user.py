import requests
import json

# Backend URL
BACKEND_URL = "http://localhost:8000"

def create_test_user():
    """Create a test user for the application"""
    
    # Test user credentials
    username = "testuser"
    password = "testpass123"
    
    # Register the user
    register_data = {
        "username": username,
        "password": password
    }
    
    try:
        # Register user
        register_response = requests.post(
            f"{BACKEND_URL}/api/register",
            data=register_data
        )
        
        if register_response.status_code == 200:
            print(f"✅ User '{username}' registered successfully!")
        elif register_response.status_code == 400:
            print(f"ℹ️  User '{username}' already exists!")
        else:
            print(f"❌ Registration failed: {register_response.text}")
            return None
        
        # Login to get token
        login_response = requests.post(
            f"{BACKEND_URL}/api/login",
            data=register_data
        )
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            print(f"✅ Login successful! Token: {token_data['access_token'][:20]}...")
            return token_data['access_token']
        else:
            print(f"❌ Login failed: {login_response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Make sure the backend server is running on http://localhost:8000")
        return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

if __name__ == "__main__":
    print("🔧 Creating test user for inSightFull application...")
    token = create_test_user()
    
    if token:
        print("\n📋 Test User Credentials:")
        print("Username: testuser")
        print("Password: testpass123")
        print(f"Token: {token}")
        print("\n💡 Use these credentials to login in the frontend application!")
    else:
        print("\n❌ Failed to create test user. Please check your backend server.")

