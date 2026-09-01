import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TransactionModal from './TransactionModal';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import './AppLayout.css';

const AppLayout = () => {
  const { toastMessage } = useFinance();
  return (
    <div className="app-layout">
      <div className="content-area">
        <Outlet />
      </div>
      <BottomNav />
      <TransactionModal />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              padding: '12px 20px',
              borderRadius: '30px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 1000,
              minWidth: '280px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>{toastMessage.message}</span>
            {toastMessage.onUndo && (
              <button 
                onClick={toastMessage.onUndo}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'none', border: 'none', 
                  color: 'var(--color-primary)', fontWeight: 'bold', 
                  fontSize: '14px', cursor: 'pointer', padding: '4px 8px',
                  borderRadius: '12px', backgroundColor: 'var(--color-primary-light)20'
                }}
              >
                <RotateCcw size={14} /> Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
