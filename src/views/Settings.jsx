import React from 'react';
import { ChevronLeft, Moon, Sun, IndianRupee, Database, ChevronRight, AlertTriangle, Palette, LogOut, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { currency, setCurrency, clearAllData, theme, toggleTheme } = useFinance();
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('finance_language', newLang);
  };

  const handleSignOut = async () => {
    if (window.confirm(t('settings.signOutConfirm'))) {
      await signOut();
    }
  };

  const handleClearData = () => {
    if (window.confirm(t('settings.clearDataConfirm'))) {
      clearAllData();
    }
  };

  return (
    <div className="settings-view animate-slide-up">
      <div className="page-header flex justify-between items-center mb-6">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold mr-auto ml-2">{t('settings.title')}</h2>
      </div>


      {/* ── Account card ── */}
      {user && (
        <div className="settings-section mb-6">
          <h3 className="section-label">{t('settings.account')}</h3>
          <div className="settings-card">
            <div className="settings-item flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div className="setting-icon" style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}>
                  <User size={20} />
                </div>
              )}
              <div>
                <span className="font-semibold">{user.displayName || 'User'}</span>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences ── */}
      <div className="settings-section">
        <h3 className="section-label">{t('settings.preferences')}</h3>

        <div className="settings-card">
          {/* Theme Toggle */}
          <div className="settings-item flex justify-between items-center" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(157, 125, 242, 0.12)', color: 'var(--color-primary)' }}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <span className="font-semibold">{t('settings.appearance')}</span>
                <p className="text-xs text-muted">{theme === 'light' ? t('settings.darkMode') : t('settings.lightMode')}</p>
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
                <span className="font-semibold">{t('settings.currency')}</span>
                <p className="text-xs text-muted">{t('settings.currencyDesc')}</p>
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

          <div className="settings-divider"></div>

          {/* Language */}
          <div className="settings-item flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <Globe size={20} />
              </div>
              <div>
                <span className="font-semibold">{t('settings.language')}</span>
                <p className="text-xs text-muted">{t('settings.languageDesc')}</p>
              </div>
            </div>
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="currency-select text-sm font-bold"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      <div className="settings-section mt-6">
        <h3 className="section-label">{t('settings.about')}</h3>
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Palette size={20} />
              </div>
              <div>
                <span className="font-semibold">{t('appName')}</span>
                <p className="text-xs text-muted">{t('settings.version')} 1.0.0</p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-text-muted)" />
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="settings-section mt-6">
        <h3 className="section-label">{t('settings.dataManagement')}</h3>
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center" onClick={handleClearData}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                <Database size={20} />
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>{t('settings.clearData')}</span>
                <p className="text-xs text-muted">{t('settings.clearDataDesc')}</p>
              </div>
            </div>
            <AlertTriangle size={20} color="var(--color-danger)" />
          </div>
        </div>
      </div>

      {/* ── Sign Out ── */}
      <div className="settings-section mt-6">
        <div className="settings-card">
          <div className="settings-item flex justify-between items-center" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
            <div className="flex items-center gap-3">
              <div className="setting-icon" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <LogOut size={20} />
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>{t('settings.signOut')}</span>
                <p className="text-xs text-muted">{t('settings.signOutDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
