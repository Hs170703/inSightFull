import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Files({ authToken }) {
  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [authToken]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/user/files', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        setError('Failed to fetch files.');
        setUserFiles([]);
        return;
      }
      const data = await response.json();
      setUserFiles(data);
    } catch (err) {
      setError('Failed to fetch files: ' + err.message);
      setUserFiles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your files...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Your Uploaded Files</h1>
        <p className="page-subtitle">Manage and analyze your CSV datasets</p>
      </div>
      
      {error && (
        <div className="card bg-error mb-6">
          <div className="card-body">
            <div className="status-error">{error}</div>
          </div>
        </div>
      )}

      {userFiles.length === 0 && !error && (
        <div className="card text-center">
          <div className="card-body" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
            <h3 className="mb-4" style={{ color: 'var(--neutral-600)' }}>No Files Yet</h3>
            <p className="mb-6" style={{ color: 'var(--neutral-500)' }}>
              You haven't uploaded any files yet. Upload a CSV file to start analyzing your data.
            </p>
            <Link to="/" className="btn btn-primary">
              📤 Upload Your First File
            </Link>
          </div>
        </div>
      )}

      {userFiles.length > 0 && (
        <div className="grid grid-2">
          {userFiles.map((file) => (
            <div key={file._id} className="card">
              <div className="card-header">
                <h3 className="card-title">
                  📁 {file.filename}
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '0.25rem' }}>
                  📅 {file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : 'Unknown date'}
                </div>
              </div>
              
              <div className="card-body">
                <div className="grid grid-2 mb-4">
                  <div className="metric-card bg-success">
                    <div className="metric-label">Rows</div>
                    <div className="metric-value status-success">
                      {file.file_data.n_rows.toLocaleString()}
                    </div>
                  </div>
                  <div className="metric-card bg-warning">
                    <div className="metric-label">Columns</div>
                    <div className="metric-value status-warning">
                      {file.file_data.n_columns}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>Columns:</h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {file.file_data.columns.map((column, index) => (
                      <span key={index} style={{ 
                        background: 'var(--neutral-100)', 
                        color: 'var(--neutral-700)',
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        border: '1px solid var(--neutral-200)'
                      }}>
                        {column}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>Null Values:</h4>
                  <div className="card" style={{ 
                    background: 'var(--neutral-50)', 
                    padding: '1rem',
                    maxHeight: '100px',
                    overflowY: 'auto',
                    fontSize: '0.875rem'
                  }}>
                    {Object.entries(file.file_data.null_counts)
                      .filter(([, count]) => count > 0)
                      .map(([column, count]) => (
                        <div key={column} className="mb-1">
                          <strong>{column}:</strong> <span className="status-error">{count} null values</span>
                        </div>
                      ))}
                    {Object.values(file.file_data.null_counts).every(count => count === 0) && (
                      <div className="status-success" style={{ fontWeight: '600' }}>
                        ✅ No null values found
                      </div>
                    )}
                  </div>
                </div>

                <Link to="/" className="btn btn-primary w-full">
                  🔍 Analyze This File
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Files;
