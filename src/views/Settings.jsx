import React, { useState } from 'react';
import { ChevronLeft, Moon, Sun, DollarSign, Database, ChevronRight, AlertTriangle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Settings.css';

const Settings = () => {
  const { currency, setCurrency, clearAllData } = useFinance();
  const [theme, setTheme] = useState('light'); // Mock theme for now

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all transactions, budgets, and goals? This cannot be undone.")) {
      clearAllData();
      alert("All data has been cleared.");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, this would toggle a class on the body/html
  };

  return (
    <div className="settings-view animate-slide-up">
      <div className="page-header flex justify-between items-center mb-6">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold mr-auto ml-2">Settings</h2>
      </div>

      <div className="settings-section">
        <h3 className="section-label">Preferences</h3>
        
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{backgroundColor: 'rgba(157, 125, 242, 0.1)', color: 'var(--color-primary)'}}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <span className="font-semibold">Appearance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted capitalize">{theme} Mode</span>
              <ChevronRight size={16} color="var(--color-text-muted)" />
            </div>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-item flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e'}}>
                <DollarSign size={20} />
              </div>
              <span className="font-semibold">Currency</span>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="currency-select text-sm font-bold text-primary"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section mt-8">
        <h3 className="section-label">Data Management</h3>
        
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center" onClick={handleClearData}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{backgroundColor: '#fee2e2', color: '#ef4444'}}>
                <Database size={20} />
              </div>
              <div>
                <span className="font-semibold text-danger">Clear All Data</span>
                <p className="text-xs text-muted">Delete all transactions & goals</p>
              </div>
            </div>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
