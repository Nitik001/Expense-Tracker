import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TransactionModal from './TransactionModal';
import './AppLayout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <div className="content-area">
        <Outlet />
      </div>
      <BottomNav />
      <TransactionModal />
    </div>
  );
};

export default AppLayout;
