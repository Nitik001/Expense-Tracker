import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './views/Home';
import Report from './views/Report';
import Plan from './views/Plan';
import Settings from './views/Settings';
import Login from './views/Login';
import { FinanceProvider } from './context/FinanceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Inner component that can access AuthContext
const AppRoutes = () => {
  const { user, authLoading } = useAuth();

  // Show a full-screen loading spinner while Firebase checks auth state
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg, #0f0f1a)',
        flexDirection: 'column', gap: '1rem',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#7c3aed',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Loading…</span>
      </div>
    );
  }

  // Not signed in → show Login screen
  if (!user) return <Login />;

  // Signed in → show the full app
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
            <Route path="plan" element={<Plan />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
