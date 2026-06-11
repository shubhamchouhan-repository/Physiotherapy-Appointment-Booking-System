import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    authApi.verifyEmail(token)
      .then((res) => { setStatus('success'); setMessage(res.data.message); })
      .catch((err) => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed.'); });
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Verifying your email…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 className="auth-title">Email Verified!</h2>
            <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Sign In Now
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h2 className="auth-title">Verification Failed</h2>
            <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>{message}</p>
            <Link to="/register" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Try Registering Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}