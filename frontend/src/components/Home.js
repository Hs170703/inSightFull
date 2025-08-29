import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ authToken, loggedInUser }) {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [targetColumn, setTargetColumn] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [selectedModel, setSelectedModel] = useState('linear_regression');
  const [showAnalyzeOptions, setShowAnalyzeOptions] = useState(false);

  const uploadToBackend = async (file) => {
    if (!authToken) {
      setError('Please login to upload files');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadResponse(null);
    setTargetColumn('');
    setShowAnalyzeOptions(false);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/upload?save_to_db=${saveToDb}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        // Provide helpful guidance for common errors
        if (data.error.includes("Not enough samples per class")) {
          alert(`Classification Error: ${data.error}\n\n💡 Tip: Try using a different target column with more unique values, or use Linear Regression for numeric predictions.`);
        } else {
          alert(`Upload failed: ${data.error}`);
        }
      } else {
        setUploadResponse(data);
        setShowAnalyzeOptions(true);
        // Show success alert instead of displaying response
        alert(`File uploaded successfully! ${data.message}`);
      }
    } catch (err) {
      setError('Failed to upload to backend: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError('');
    setUploadResponse(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFile(file);
  };

  const handleFile = (file) => {
    setFileName(file.name);
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported in this demo.');
      setPreview([]);
      return;
    }
    // Show local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').slice(0, 6); // header + 5 rows
      const previewRows = rows.map((row) => row.split(','));
      setPreview(previewRows);
    };
    reader.readAsText(file);
    // Upload to backend
    uploadToBackend(file);
  };

  const handleFileInput = (e) => {
    setError('');
    setUploadResponse(null);
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleTargetChange = (e) => {
    setTargetColumn(e.target.value);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleAnalyze = async () => {
    if (!targetColumn) {
      setError('Please select a target column for prediction.');
      return;
    }
    setIsPredicting(true);
    setError('');
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          filename: uploadResponse.filename,
          target_column: targetColumn,
          model_type: selectedModel,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        // Provide helpful guidance for common errors
        if (data.error.includes("Not enough samples per class")) {
          alert(`Classification Error: ${data.error}\n\n💡 Tip: Try using a different target column with more unique values, or use Linear Regression for numeric predictions.`);
        } else if (data.error.includes("cannot access local variable")) {
          alert(`System Error: ${data.error}\n\n💡 Tip: Please try again or contact support.`);
        } else {
          alert(`Analysis failed: ${data.error}`);
        }
      } else {
        // Show success alert
        const modelName = selectedModel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        alert(`Analysis completed successfully with ${modelName}! Navigate to Results to view details.`);
        // Navigate to results page with the new result
        navigate('/results');
      }
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setIsPredicting(false);
    }
  };

  const handlePredictYourself = () => {
    navigate('/predict-yourself');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Smart Data Analyzer</h1>
        <p className="page-subtitle">Upload your CSV files and get instant insights with machine learning</p>
      </div>
      
      {!authToken && (
        <div className="card mb-8" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <div className="card-body bg-warning">
            <h3 className="status-warning mb-2">🔐 Login Required</h3>
            <p className="status-warning" style={{ margin: 0 }}>
              Please login to upload files and perform data analysis. Your files and results will be saved to your account.
            </p>
          </div>
        </div>
      )}

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div 
          className="card-body text-center"
          style={{
            border: '2px dashed var(--neutral-300)',
            borderRadius: 'var(--border-radius)',
            padding: '3rem',
            cursor: authToken ? 'pointer' : 'not-allowed',
            opacity: authToken ? 1 : 0.6,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            transition: 'var(--transition)'
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => authToken && fileInputRef.current.click()}
          onMouseEnter={(e) => {
            if (authToken) {
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.background = 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--neutral-300)';
            e.target.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)';
          }}
        >
          <input
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInput}
            disabled={!authToken}
          />
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', margin: '0 0 1rem 0' }}>
            Drag & drop a CSV file here, or click to select
          </p>
          {fileName && (
            <div className="card" style={{ display: 'inline-block', padding: '0.5rem 1rem', marginTop: '1rem' }}>
              <strong>Selected: {fileName}</strong>
            </div>
          )}
          {isUploading && (
            <div className="loading-container" style={{ padding: '1rem' }}>
              <div className="loading-spinner"></div>
              <div className="loading-text">Uploading...</div>
            </div>
          )}
          {error && (
            <div className="card bg-error" style={{ marginTop: '1rem', padding: '1rem' }}>
              <div className="status-error">{error}</div>
            </div>
          )}
        </div>
      </div>

      {authToken && (
        <div className="text-center mt-4">
          <label className="flex items-center justify-center gap-2" style={{ fontSize: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={saveToDb}
              onChange={e => setSaveToDb(e.target.checked)}
              style={{ 
                width: '18px', 
                height: '18px',
                accentColor: 'var(--primary-color)'
              }}
            />
            Save this file to the database (MongoDB)
          </label>
        </div>
      )}

      {showAnalyzeOptions && uploadResponse && uploadResponse.columns && (
        <div className="card mt-8" style={{ maxWidth: '600px', margin: '2rem auto 0 auto' }}>
          <div className="card-header">
            <h3 className="card-title">🎯 Analyze Your Data</h3>
          </div>
          <div className="card-body">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="target-col" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Select target column:
                </label>
                <select 
                  id="target-col" 
                  value={targetColumn} 
                  onChange={handleTargetChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--neutral-200)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="">-- Select Target Column --</option>
                  {uploadResponse.columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '0.5rem' }}>
                  💡 <strong>Tips:</strong> Use "Sales" or "Advertising_Spend" for regression, "Month" for classification
                </div>
              </div>
              
              <div>
                <label htmlFor="model-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Select Machine Learning Model:
                </label>
                <select 
                  id="model-select" 
                  value={selectedModel} 
                  onChange={handleModelChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--neutral-200)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '1rem',
                    background: 'white'
                  }}
                >
                  <option value="linear_regression">Linear Regression (for numeric predictions)</option>
                  <option value="logistic_regression">Logistic Regression (for classification)</option>
                  <option value="naive_bayes">Naive Bayes (for classification)</option>
                </select>
              </div>
              
              <button 
                className={`btn ${isPredicting ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleAnalyze} 
                disabled={isPredicting}
                style={{ width: '100%' }}
              >
                {isPredicting ? (
                  <>
                    <div className="loading-spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🔍 Analyze with {selectedModel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {authToken && (
        <div className="card mt-6" style={{ maxWidth: '600px', margin: '1.5rem auto 0 auto' }}>
          <div className="card-header">
            <h3 className="card-title">🚀 Advanced Features</h3>
          </div>
          <div className="card-body">
            <button 
              className="btn btn-secondary w-full"
              onClick={handlePredictYourself}
              style={{ marginBottom: '1rem' }}
            >
              🎯 Predict Yourself
            </button>
            <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', margin: 0 }}>
              Upload your own code and data to get custom predictions
            </p>
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="card mt-6" style={{ maxWidth: '800px', margin: '1.5rem auto 0 auto' }}>
          <div className="card-header">
            <h3 className="card-title">👀 Preview (first 5 rows)</h3>
          </div>
          <div className="card-body">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} style={{ 
                      borderBottom: i === 0 ? '2px solid var(--primary-color)' : '1px solid var(--neutral-200)',
                      background: i === 0 ? 'var(--neutral-50)' : 'white'
                    }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ 
                          padding: '0.75rem', 
                          fontWeight: i === 0 ? '600' : '400',
                          color: i === 0 ? 'var(--primary-color)' : 'var(--neutral-700)'
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
