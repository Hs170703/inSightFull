import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Results({ authToken }) {
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [authToken]);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/user/results', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        setError('Failed to fetch results.');
        setUserResults([]);
        return;
      }
      const data = await response.json();
      setUserResults(data);
    } catch (err) {
      setError('Failed to fetch results: ' + err.message);
      setUserResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your results...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Your Regression Results</h1>
        <p className="page-subtitle">View and analyze your machine learning predictions</p>
      </div>
      
      {error && (
        <div className="card bg-error mb-6">
          <div className="card-body">
            <div className="status-error">{error}</div>
          </div>
        </div>
      )}

      {userResults.length === 0 && !error && (
        <div className="card text-center">
          <div className="card-body" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h3 className="mb-4" style={{ color: 'var(--neutral-600)' }}>No Results Yet</h3>
            <p className="mb-6" style={{ color: 'var(--neutral-500)' }}>
              You haven't performed any regression analysis yet. Upload a CSV file and run predictions to see your results here.
            </p>
            <Link to="/" className="btn btn-primary">
              🚀 Go to Home
            </Link>
          </div>
        </div>
      )}

      {userResults.length > 0 && (
        <div className="grid grid-3">
          {userResults.map((result) => (
            <div key={result._id} className="card">
              <div className="card-header">
                <h3 className="card-title">📊 {result.filename}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
                  {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Unknown date'}
                </div>
              </div>
              
              <div className="card-body">
                <div className="mb-4">
                  <div className="metric-card bg-success mb-2">
                    <div className="metric-label">Target</div>
                    <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                      {result.result.target_column}
                    </div>
                  </div>
                  <div className="metric-card bg-warning mb-2">
                    <div className="metric-label">Features</div>
                    <div style={{ fontWeight: '600' }}>
                      {result.result.feature_columns?.length || 'N/A'} columns
                    </div>
                  </div>
                  <div className="metric-card bg-info mb-2">
                    <div className="metric-label">Model</div>
                    <div style={{ fontWeight: '600', color: 'var(--info-color)' }}>
                      {result.result.model_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Linear Regression'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-2 mb-4">
                  {result.result.is_classification ? (
                    <>
                      <div className="metric-card">
                        <div className="metric-label">Accuracy</div>
                        <div className="metric-value status-success">
                          {(result.result.metrics.accuracy * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-label">Type</div>
                        <div className="metric-value status-info">
                          Classification
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="metric-card">
                        <div className="metric-label">R² Score</div>
                        <div className="metric-value status-success">
                          {(result.result.metrics.r2_score * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-label">RMSE</div>
                        <div className="metric-value status-warning">
                          {result.result.metrics.rmse.toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <Link to={`/results/${result._id}`} className="btn btn-primary w-full">
                  📈 View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;
