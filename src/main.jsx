import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Synaptix Root Crash Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('lumosity_zihin_lab_user_data_v6');
    } catch (_) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#090d16',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: 'rgba(18, 26, 43, 0.95)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '560px',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', color: '#f87171' }}>
              Zihin Laboratuvarı Başlatılıyor
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Tarayıcının önbelleğindeki eski veriler güncellenirken bir uyumsuzluk algılandı. Temiz bir başlangıç yapmak için aşağıdaki butona tıkla.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Verileri Sıfırla ve Yeniden Başlat
              </button>
            </div>
            {this.state.error && (
              <pre style={{
                marginTop: '1.5rem',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#ef4444',
                textAlign: 'left',
                overflowX: 'auto'
              }}>
                {String(this.state.error?.message || this.state.error)}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

