import React from 'react';
import { ChevronLeft, Moon, Sun, IndianRupee, Database, ChevronRight, AlertTriangle, Palette } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Settings.css';

const Settings = () => {
  const { currency, setCurrency, clearAllData, theme, toggleTheme } = useFinance();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all transactions, budgets, and goals? This cannot be undone.')) {
      clearAllData();
    }
  };

  return (
    <div className="settings-view animate-slide-up">
      <div className="page-header flex justify-between items-center mb-6">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold mr-auto ml-2">Settings</h2>
      </div>

      {/* ── Preferences ── */}
      <div className="settings-section">
        <h3 className="section-label">Preferences</h3>

        <div className="settings-card">
          {/* Theme Toggle */}
          <div className="settings-item flex justify-between items-center" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(157, 125, 242, 0.12)', color: 'var(--color-primary)' }}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <span className="font-semibold">Appearance</span>
                <p className="text-xs text-muted">{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</p>
              </div>
            </div>
            {/* Toggle Switch */}
            <div className={`theme-toggle ${theme === 'dark' ? 'on' : ''}`}>
              <div className="theme-toggle-knob">
                {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              </div>
            </div>
          </div>

          <div className="settings-divider"></div>

          {/* Currency */}
          <div className="settings-item flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                <IndianRupee size={20} />
              </div>
              <div>
                <span className="font-semibold">Currency</span>
                <p className="text-xs text-muted">Choose your display currency</p>
              </div>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select text-sm font-bold"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div className="settings-section mt-6">
        <h3 className="section-label">About</h3>
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Palette size={20} />
              </div>
              <div>
                <span className="font-semibold">Finance Tracker</span>
                <p className="text-xs text-muted">Version 1.0.0</p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="settings-section mt-6">
        <h3 className="section-label">Data Management</h3>
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center" onClick={handleClearData}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                <Database size={20} />
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>Clear All Data</span>
                <p className="text-xs text-muted">Delete all transactions &amp; goals</p>
              </div>
            </div>
            <AlertTriangle size={20} color="var(--color-danger)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
