import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PredictYourself({ authToken }) {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (file) => {
    setFileName(file.name);
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported.');
      return;
    }
    setError('');
  };

  const handleFileInput = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError('');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFile(file);
  };

  const handleSubmit = async () => {
    if (!fileName) {
      setError('Please select a CSV file.');
      return;
    }
    if (!customCode.trim()) {
      setError('Please provide your custom code.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      // For now, we'll show a placeholder result
      // In a real implementation, you'd send the code and file to the backend
      setTimeout(() => {
        setResult({
          message: "Custom prediction completed!",
          accuracy: 0.85,
          predictions: [1, 0, 1, 1, 0],
          features_used: ["feature1", "feature2", "feature3"]
        });
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError('Processing failed: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🎯 Predict Yourself</h1>
        <p className="page-subtitle">Upload your own code and data for custom predictions</p>
      </div>

      {!authToken && (
        <div className="card mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <div className="card-body bg-warning">
            <h3 className="status-warning mb-2">🔐 Login Required</h3>
            <p className="status-warning" style={{ margin: 0 }}>
              Please login to use the custom prediction feature.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-2 gap-6" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* File Upload Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📁 Upload Your Data</h3>
          </div>
          <div className="card-body">
            <div 
              className="text-center"
              style={{
                border: '2px dashed var(--neutral-300)',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--neutral-300)';
              }}
            >
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInput}
              />
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
              <p style={{ fontSize: '1rem', color: 'var(--neutral-600)', margin: '0 0 1rem 0' }}>
                Drag & drop a CSV file here, or click to select
              </p>
              {fileName && (
                <div className="card" style={{ display: 'inline-block', padding: '0.5rem 1rem' }}>
                  <strong>Selected: {fileName}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Input Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💻 Your Custom Code</h3>
          </div>
          <div className="card-body">
            <div>
              <label htmlFor="custom-code" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Paste your Python code here:
              </label>
              <textarea
                id="custom-code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder={`# Example code:
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Your custom preprocessing and modeling code here
# The data will be available as 'df' variable
# Return your predictions as a list or array`}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '1rem',
                  border: '2px solid var(--neutral-200)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  background: 'var(--neutral-50)',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-6">
        <button 
          className={`btn ${isProcessing ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleSubmit} 
          disabled={isProcessing || !authToken}
          style={{ minWidth: '200px' }}
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div>
              Processing...
            </>
          ) : (
            '🚀 Run Custom Prediction'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card bg-error mt-6" style={{ maxWidth: '600px', margin: '1.5rem auto 0 auto' }}>
          <div className="card-body">
            <div className="status-error">{error}</div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="card mt-6" style={{ maxWidth: '800px', margin: '1.5rem auto 0 auto' }}>
          <div className="card-header">
            <h3 className="card-title">📊 Custom Prediction Results</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-2 mb-4">
              <div className="metric-card bg-success">
                <div className="metric-label">Accuracy</div>
                <div className="metric-value status-success">
                  {(result.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="metric-card bg-info">
                <div className="metric-label">Features Used</div>
                <div className="metric-value status-info">
                  {result.features_used.length}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>Sample Predictions:</h4>
              <div style={{ 
                background: 'var(--neutral-50)', 
                padding: '1rem', 
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.875rem'
              }}>
                {result.predictions.slice(0, 10).join(', ')}
                {result.predictions.length > 10 && '...'}
              </div>
            </div>

            <div className="text-center">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setResult(null);
                  setCustomCode('');
                  setFileName('');
                }}
              >
                🔄 Try Another Prediction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card mt-6" style={{ maxWidth: '800px', margin: '1.5rem auto 0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">📖 How to Use</h3>
        </div>
        <div className="card-body">
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Upload your CSV dataset</li>
            <li>Write your custom Python code for preprocessing and modeling</li>
            <li>The data will be available as a pandas DataFrame named 'df'</li>
            <li>Your code should return predictions as a list or array</li>
            <li>Click "Run Custom Prediction" to execute your code</li>
          </ol>
          <div className="mt-4 p-3" style={{ background: 'var(--warning-50)', borderRadius: 'var(--border-radius-sm)' }}>
            <strong>⚠️ Note:</strong> This feature is currently in development. For now, it shows a placeholder result.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictYourself;
