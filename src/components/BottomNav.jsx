import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Briefcase, Settings, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import './BottomNav.css';

const BottomNav = () => {
  const { openModal } = useFinance();
  const { t } = useTranslation();

  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} />
        <span>{t('nav.home')}</span>
      </NavLink>
      
      <NavLink to="/report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BarChart2 size={24} />
        <span>{t('nav.report')}</span>
      </NavLink>

      <div className="nav-fab-container">
        <button className="fab-button" onClick={() => openModal()}>
          <Plus size={24} color="#fff" />
        </button>
      </div>

      <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Briefcase size={24} />
        <span>{t('nav.plan')}</span>
      </NavLink>

      <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <Settings size={24} />
        <span>{t('nav.settings')}</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
