# inSightFull Frontend Redesign Guide

This document contains all the changes needed to transform your data analytics application into a modern, sophisticated interface.

## Design System Overview

**Color Palette:**
- Primary: #15803d (green-700) - Professional, trustworthy
- Accent: #84cc16 (lime-500) - Energy, innovation
- Neutrals: #ffffff, #f0fdf4, #374151, #1f2937
- Success: #10b981, Error: #ef4444, Warning: #f59e0b

**Typography:**
- Primary Font: DM Sans (Bold for headings, Regular for body)
- Font Scale: 14px, 16px, 18px, 20px, 24px, 32px

---

## File Changes Required

### 1. **src/App.css** - Complete Replacement

Replace the entire content with modern design system:

\`\`\`css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

/* CSS Custom Properties */
:root {
  --primary-color: #15803d;
  --primary-hover: #166534;
  --accent-color: #84cc16;
  --accent-hover: #65a30d;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --border-radius: 12px;
  --border-radius-sm: 8px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global Styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--neutral-700);
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  min-height: 100vh;
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Modern Navigation */
.top-navbar {
  background: linear-gradient(135deg, var(--primary-color) 0%, #166534 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.company-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: -0.025em;
  transition: var(--transition);
}

.company-name:hover {
  transform: translateY(-1px);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu-items {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.menu-btn {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}

.menu-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.menu-btn.active {
  color: var(--primary-color);
  background: white;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn {
  background: white;
  color: var(--primary-color);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-md);
}

.login-btn:hover {
  background: var(--neutral-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Modern Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: white;
  padding: 2.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-xl);
  min-width: 400px;
  max-width: 90vw;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neutral-800);
  text-align: center;
}

.modal input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--neutral-200);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: var(--transition);
  font-family: inherit;
}

.modal input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1);
}

.modal button {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 0.5rem;
}

.modal button[type="submit"] {
  background: var(--primary-color);
  color: white;
}

.modal button[type="submit"]:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.modal button[type="button"] {
  background: var(--neutral-100);
  color: var(--neutral-600);
}

.modal button[type="button"]:hover {
  background: var(--neutral-200);
}

/* Page Containers */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--neutral-800);
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--neutral-600);
  margin: 0;
}

/* Modern Cards */
.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--neutral-100);
  transition: var(--transition);
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-100);
  background: linear-gradient(135deg, var(--neutral-50), white);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-body {
  padding: 1.5rem;
}

/* Modern Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), #166534);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--neutral-100);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-200);
}

.btn-secondary:hover {
  background: var(--neutral-200);
  transform: translateY(-1px);
}

.btn-accent {
  background: linear-gradient(135deg, var(--accent-color), #65a30d);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Grid Layouts */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Metric Cards */
.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 1px solid var(--neutral-100);
  transition: var(--transition);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--neutral-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.metric-description {
  font-size: 0.75rem;
  color: var(--neutral-500);
  margin-top: 0.25rem;
}

/* Status Indicators */
.status-success { color: var(--success-color); }
.status-error { color: var(--error-color); }
.status-warning { color: var(--warning-color); }

.bg-success { background-color: #ecfdf5; }
.bg-error { background-color: #fef2f2; }
.bg-warning { background-color: #fffbeb; }

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--neutral-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.125rem;
  color: var(--neutral-600);
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .top-navbar {
    padding: 0 1rem;
    height: 64px;
  }
  
  .company-name {
    font-size: 1.5rem;
  }
  
  .menu-items {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-color);
    flex-direction: column;
    padding: 1rem;
    gap: 0;
    display: none;
  }
  
  .menu-items.open {
    display: flex;
  }
  
  .menu-btn {
    width: 100%;
    text-align: left;
    padding: 1rem;
    border-radius: var(--border-radius-sm);
  }
  
  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .hamburger .bar {
    width: 24px;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: var(--transition);
  }
  
  .page-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .modal {
    min-width: 320px;
    margin: 1rem;
  }
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

.w-full { width: 100%; }
.h-full { height: 100%; }

.rounded { border-radius: var(--border-radius-sm); }
.rounded-lg { border-radius: var(--border-radius); }

.shadow { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
\`\`\`

### 2. **src/components/Home.js** - Style Updates

Replace all inline styles with modern classes:

\`\`\`javascript
// Replace the return statement with:
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

    {uploadResponse && uploadResponse.columns && (
      <div className="card mt-8" style={{ maxWidth: '600px', margin: '2rem auto 0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">🎯 What do you want to do?</h3>
        </div>
        <div className="card-body">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="target-col" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Select target column for Linear Regression prediction:
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
            </div>
            <button 
              className={`btn ${isPredicting ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handlePredict} 
              disabled={isPredicting}
              style={{ width: '100%' }}
            >
              {isPredicting ? (
                <>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div>
                  Predicting...
                </>
              ) : (
                <>
                  🚀 Predict with Linear Regression
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {uploadResponse && (
      <div className="card mt-6" style={{ maxWidth: '600px', margin: '1.5rem auto 0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">📋 Backend Response</h3>
        </div>
        <div className="card-body">
          <pre style={{ 
            background: 'var(--neutral-50)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius-sm)', 
            overflow: 'auto',
            fontSize: '0.875rem',
            border: '1px solid var(--neutral-200)'
          }}>
            {JSON.stringify(uploadResponse, null, 2)}
          </pre>
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
\`\`\`

### 3. **src/components/Files.js** - Modern Card Layout

Replace the return statement with:

\`\`\`javascript
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

    {loading && (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your files...</div>
      </div>
    )}

    {userFiles.length === 0 && !error && !loading && (
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
\`\`\`

### 4. **src/components/Results.js** - Modern Grid Layout

You'll need to read this file first, but the general structure should be:

\`\`\`javascript
// Replace the results grid with modern cards
<div className="page-container">
  <div className="page-header">
    <h1 className="page-title">Your Regression Results</h1>
    <p className="page-subtitle">View and analyze your machine learning predictions</p>
  </div>
  
  <div className="grid grid-3">
    {results.map((result) => (
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
          </div>
          
          <div className="grid grid-2 mb-4">
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
          </div>
          
          <Link to={`/results/${result._id}`} className="btn btn-primary w-full">
            📈 View Details →
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>
\`\`\`

### 5. **src/components/ResultDetail.js** - Dashboard Enhancement

Replace the metrics rendering and overall layout with modern dashboard components using the same card system and metric cards shown above.

### 6. **src/components/Navbar.js** - No Changes Needed

The Navbar component already uses CSS classes, so the new CSS will automatically apply the modern styling.

### 7. **src/components/LoginModal.js** - No Changes Needed

The LoginModal already uses CSS classes and will automatically get the new modern styling.

---

## Implementation Steps

1. **Replace src/App.css** with the complete modern CSS above
2. **Update src/components/Home.js** with the new JSX structure
3. **Update src/components/Files.js** with the modern card layout
4. **Read and update src/components/Results.js** with the grid layout
5. **Update src/components/ResultDetail.js** with dashboard styling
6. **Test all pages** to ensure functionality is preserved

## Key Features Added

- **Modern Color System**: Professional green palette with proper contrast
- **Typography**: DM Sans font family with proper hierarchy
- **Animations**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: Proper focus states and color contrast
- **Loading States**: Modern spinners and feedback
- **Card System**: Consistent card-based layout throughout
- **Gradient Effects**: Subtle gradients for visual appeal
- **Glass Morphism**: Modern backdrop blur effects
- **Micro-interactions**: Hover states and button animations

This redesign transforms your application from a basic utility into a professional, modern data analytics platform while maintaining all existing functionality.
