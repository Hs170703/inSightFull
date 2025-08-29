import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ResultDetail({ authToken }) {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResultDetail();
  }, [resultId, authToken]);

  const fetchResultDetail = async () => {
    try {
      const response = await fetch(`/api/user/results/${resultId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        setError('Failed to fetch result details.');
        return;
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to fetch result details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMetrics = (metrics, isClassification = false) => {
    if (!metrics) return <div className="status-error">No metrics available.</div>;
    
    if (isClassification) {
      return (
        <div className="grid grid-3 mb-6">
          <div className="metric-card bg-success">
            <div className="metric-label">Accuracy</div>
            <div className="metric-value status-success">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="metric-description">Model Accuracy</div>
          </div>
          <div className="metric-card bg-info">
            <div className="metric-label">Type</div>
            <div className="metric-value status-info">
              Classification
            </div>
            <div className="metric-description">Model Type</div>
          </div>
          <div className="metric-card bg-warning">
            <div className="metric-label">Classes</div>
            <div className="metric-value status-warning">
              {metrics.classification_report ? Object.keys(metrics.classification_report).filter(key => key !== 'accuracy' && key !== 'macro avg' && key !== 'weighted avg').length : 'N/A'}
            </div>
            <div className="metric-description">Number of Classes</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-3 mb-6">
          <div className="metric-card bg-success">
            <div className="metric-label">R² Score</div>
            <div className="metric-value status-success">
              {(metrics.r2_score * 100).toFixed(1)}%
            </div>
            <div className="metric-description">Model Accuracy</div>
          </div>
          <div className="metric-card bg-warning">
            <div className="metric-label">RMSE</div>
            <div className="metric-value status-warning">
              {metrics.rmse.toFixed(2)}
            </div>
            <div className="metric-description">Root Mean Square Error</div>
          </div>
          <div className="metric-card bg-success">
            <div className="metric-label">MSE</div>
            <div className="metric-value status-success">
              {metrics.mean_squared_error.toFixed(2)}
            </div>
            <div className="metric-description">Mean Square Error</div>
          </div>
        </div>
      );
    }
  };

  const renderFeatureImportance = (featureImportance) => {
    if (!featureImportance) return <div className="status-error">No feature importance available.</div>;
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">📊 Feature Importance (Coefficients)</h3>
        </div>
        <div className="card-body">
          <div className="flex flex-col gap-3">
            {Object.entries(featureImportance)
              .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
              .map(([feature, importance]) => (
              <div key={feature} className="card" style={{ 
                background: 'var(--neutral-50)', 
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: '600' }}>{feature}</span>
                <span style={{ 
                  color: importance > 0 ? 'var(--success-color)' : 'var(--error-color)',
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  {importance > 0 ? '+' : ''}{importance.toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSamplePredictions = (samplePredictions, isClassification = false) => {
    if (!samplePredictions || !samplePredictions.actual || !samplePredictions.predicted) return <div className="status-error">No sample predictions available.</div>;
    return (
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">📈 Sample Predictions</h3>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ 
                  background: 'var(--neutral-50)',
                  borderBottom: '2px solid var(--primary-color)'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actual</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Predicted</th>
                  {!isClassification && <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Difference</th>}
                  {isClassification && <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Correct</th>}
                </tr>
              </thead>
              <tbody>
                {samplePredictions.actual.map((actual, index) => {
                  const predicted = samplePredictions.predicted[index];
                  const isCorrect = isClassification ? actual === predicted : null;
                  const difference = isClassification ? null : predicted - actual;
                  return (
                    <tr key={index} style={{ 
                      borderBottom: '1px solid var(--neutral-200)',
                      background: index % 2 === 0 ? 'white' : 'var(--neutral-50)'
                    }}>
                      <td style={{ padding: '1rem' }}>{isClassification ? actual : actual.toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>{isClassification ? predicted : predicted.toFixed(2)}</td>
                      {!isClassification && (
                        <td style={{ 
                          padding: '1rem',
                          color: Math.abs(difference) < 10 ? 'var(--success-color)' : 'var(--error-color)',
                          fontWeight: '600'
                        }}>
                          {difference > 0 ? '+' : ''}{difference.toFixed(2)}
                        </td>
                      )}
                      {isClassification && (
                        <td style={{ 
                          padding: '1rem',
                          color: isCorrect ? 'var(--success-color)' : 'var(--error-color)',
                          fontWeight: '600'
                        }}>
                          {isCorrect ? '✅' : '❌'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = (charts) => (
    <div className="card mb-6">
      <div className="card-header">
        <h3 className="card-title">📊 Generated Charts</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-2">
          {Object.entries(charts).map(([chartName, chartData]) => (
            <div key={chartName} className="card" style={{ 
              background: 'var(--neutral-50)', 
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                textTransform: 'capitalize',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}>
                {chartName.replace(/_/g, ' ')}
              </h4>
              {chartData.startsWith('data:image') ? (
                <img 
                  src={chartData} 
                  alt={chartName}
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: 'var(--border-radius-sm)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
              ) : (
                <div style={{ 
                  background: 'var(--neutral-200)', 
                  padding: '3rem', 
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--neutral-600)'
                }}>
                  {chartData}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading result details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card bg-error mb-6">
          <div className="card-body">
            <div className="status-error">{error}</div>
          </div>
        </div>
        <Link to="/results" className="btn btn-primary">
          ← Back to Results
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page-container text-center">
        <div className="card">
          <div className="card-body" style={{ padding: '3rem' }}>
            <h2 className="mb-4">Result not found</h2>
            <Link to="/results" className="btn btn-primary">
              ← Back to Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link to="/results" className="btn btn-secondary">
          ← Back to Results
        </Link>
      </div>

      <div className="card mb-6" style={{ 
        background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
        border: '2px solid var(--success-color)'
      }}>
        <div className="card-body">
          <h2 style={{ 
            color: 'var(--primary-color)', 
            marginBottom: '0.5rem',
            fontSize: '1.75rem',
            fontWeight: '700'
          }}>
            📊 {result.result.model_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Linear Regression'} Results for "{result.result.target_column}"
          </h2>
          <div style={{ color: 'var(--neutral-600)' }}>
            <strong>File:</strong> {result.filename} | 
            <strong> Date:</strong> {result.timestamp ? new Date(result.timestamp).toLocaleString() : 'Unknown date'}
          </div>
        </div>
      </div>

      {renderMetrics(result.result.metrics, result.result.is_classification)}
      {renderFeatureImportance(result.result.feature_importance)}
      {renderSamplePredictions(result.result.sample_predictions, result.result.is_classification)}
      {renderCharts(result.result.charts)}

      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)', 
        border: '2px solid var(--primary-color)'
      }}>
        <div className="card-body">
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary-color)', fontWeight: '600' }}>📈 Model Summary</h4>
          <p style={{ margin: '0', lineHeight: '1.6', color: 'var(--neutral-700)' }}>
            {result.result.is_classification ? (
              <>
                The model achieved an <strong>accuracy of {(result.result.metrics.accuracy * 100).toFixed(1)}%</strong>, 
                indicating it correctly classifies {(result.result.metrics.accuracy * 100).toFixed(1)}% of the samples in {result.result.target_column}.
              </>
            ) : (
              <>
                The model achieved an <strong>R² score of {(result.result.metrics.r2_score * 100).toFixed(1)}%</strong>, 
                indicating it explains {(result.result.metrics.r2_score * 100).toFixed(1)}% of the variance in {result.result.target_column}. 
                The Root Mean Square Error is <strong>{result.result.metrics.rmse.toFixed(2)}</strong>, showing the average prediction error.
              </>
            )}
          </p>
        </div>
      </div>

      {result.result.recommendations && result.result.recommendations.length > 0 && (
        <div className="card mt-6" style={{ 
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', 
          border: '2px solid var(--warning-color)'
        }}>
          <div className="card-body">
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--warning-color)', fontWeight: '600' }}>⚠️ Model Performance Warning</h4>
            <p style={{ margin: '0 0 1rem 0', color: 'var(--neutral-700)' }}>
              This model is performing poorly. Consider the following recommendations:
            </p>
            <ul style={{ margin: '0', paddingLeft: '1.5rem', color: 'var(--neutral-700)' }}>
              {result.result.recommendations.map((rec, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultDetail;
