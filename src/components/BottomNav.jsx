import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Briefcase, Settings, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './BottomNav.css';

const BottomNav = () => {
  const { openModal } = useFinance();

  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/report" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BarChart2 size={24} />
        <span>Report</span>
      </NavLink>

      <div className="nav-fab-container">
        <button className="fab-button" onClick={openModal}>
          <Plus size={24} color="#fff" />
        </button>
      </div>

      <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Briefcase size={24} />
        <span>Plan</span>
      </NavLink>

      <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
        <Settings size={24} />
        <span>Settings</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
