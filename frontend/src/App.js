import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Results from './components/Results';
import ResultDetail from './components/ResultDetail';
import Files from './components/Files';
import PredictYourself from './components/PredictYourself';
import LoginModal from './components/LoginModal';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || '');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('loggedInUser', loggedInUser);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedInUser');
    }
  }, [authToken, loggedInUser]);

  const handleLogin = (token, username) => {
    setAuthToken(token);
    setLoggedInUser(username);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setLoggedInUser('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          loggedInUser={loggedInUser}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
        />
        
        {showLogin && (
          <LoginModal 
            onLogin={handleLogin}
            onClose={() => setShowLogin(false)}
          />
        )}

        <main className="pb-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  authToken={authToken}
                  loggedInUser={loggedInUser}
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                authToken ? (
                  <Results authToken={authToken} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/results/:resultId" 
              element={
                authToken ? (
                  <ResultDetail authToken={authToken} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/files" 
              element={
                authToken ? (
                  <Files authToken={authToken} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/predict-yourself" 
              element={
                authToken ? (
                  <PredictYourself authToken={authToken} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
