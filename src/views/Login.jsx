import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Login = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyError = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Try again.';
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user': return 'Sign-in popup was closed. Please try again.';
      case 'auth/invalid-credential': return 'Incorrect email or password. Please try again.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blur login-blur-1" />
      <div className="login-bg-blur login-blur-2" />

      <div className="login-card">
        {/* Logo + Branding */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#brandGrad)" />
              <path d="M10 28L20 12L30 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 22H26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        {/* Google Sign-In */}
        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
            <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
            <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
            <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <div className="login-divider"><span>{t('login.or')}</span></div>

        {/* Email/Password Form */}
        <form className="login-form" onSubmit={handleEmailSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">{t('login.name')}</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                className="form-input" placeholder="John Doe" required
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">{t('login.email')}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="form-input" placeholder="you@example.com" required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('login.password')}</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="form-input" placeholder="••••••••" required minLength={6}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signup' ? t('login.createAccount') : t('login.signIn')}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'signin' ? (
            <>{t('login.noAccount')} <button onClick={() => { setMode('signup'); setError(''); }}>{t('login.createOne')}</button></>
          ) : (
            <>{t('login.haveAccount')} <button onClick={() => { setMode('signin'); setError(''); }}>{t('login.signIn')}</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
