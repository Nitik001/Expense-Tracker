import React, { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Coffee, CreditCard, Sparkles, Briefcase, Plus, Clock, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import CountUpPkg from 'react-countup';
import { useTranslation } from 'react-i18next';
const CountUp = typeof CountUpPkg === 'function' ? CountUpPkg : CountUpPkg.default;
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import UpcomingSheet from '../components/UpcomingSheet';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    filteredTransactions,
    openModal,
    formatAmount,
    selectedMonthLabel,
    goToPrevMonth,
    goToNextMonth,
    selectedMonth,
    upcomingItems,
    currency,
    deleteTransaction,
    totalIncome,
    totalExpense
  } = useFinance();

  const [upcomingOpen, setUpcomingOpen] = useState(false);

  const pendingCount = upcomingItems.filter(i => !i.received).length;

  const now = new Date();
  const isCurrentMonth =
    selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth();

  const currentBalance = totalIncome - totalExpense;

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const getIconForCategory = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'groceries': return <CreditCard size={20} color="#9d7df2" />;
      case 'clothing & shoes':
      case 'clothing': return <Briefcase size={20} color="#3b82f6" />;
      case 'dining':
      case 'cafes': return <Coffee size={20} color="#22c55e" />;
      case 'salary':
      case 'income': return <TrendingUp size={20} color="#ff7f50" />;
      default: return <Plus size={20} color="#9d7df2" />;
    }
  };

  return (
    <div className="home-view animate-slide-up">
      <div className="home-header">
        <div className="header-top flex justify-between items-center">
          <div className="profile-image">
            <img src={user?.photoURL || "https://i.pravatar.cc/150?img=11"} alt="User Profile" referrerPolicy="no-referrer" />
            <div className="notification-badge"></div>
          </div>

          {/* ── Month Navigator ── */}
          <div className="month-nav flex items-center gap-2">
            <button className="month-nav-btn" onClick={goToPrevMonth}>
              <ChevronLeft size={16} color="rgba(255,255,255,0.8)" />
            </button>
            <span className="text-sm font-medium" style={{ color: 'white', minWidth: '130px', textAlign: 'center' }}>
              {selectedMonthLabel}
            </span>
            <button
              className="month-nav-btn"
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
            >
              <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
            </button>
          </div>

          <div className="icon-btn header-icon">
            <Bell size={20} color="#fff" />
            <div className="notification-dot"></div>
          </div>
        </div>

        <div className="balance-section flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {t('home.balance')}
          </span>
          <h1 className="text-4xl font-bold flex items-center justify-center" style={{ color: 'white' }}>
            <CountUp 
              end={currentBalance} 
              duration={1} 
              separator="," 
              prefix={currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
              decimals={0}
            />
          </h1>
        </div>
      </div>

      <div className="home-content">
        <div className="money-cards flex gap-4">
          <div className="money-card">
            <div className="card-icon income-icon">
              <ArrowDown size={20} />
            </div>
            <span className="text-sm text-muted">{t('home.income')}</span>
            <h3 className="text-xl font-bold">
              <CountUp end={totalIncome} duration={1} separator="," prefix={currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'} decimals={0} />
            </h3>
          </div>
          <div className="money-card">
            <div className="card-icon expense-icon">
              <ArrowUp size={20} />
            </div>
            <span className="text-sm text-muted">{t('home.expenses')}</span>
            <h3 className="text-xl font-bold">
              <CountUp end={totalExpense} duration={1} separator="," prefix={currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'} decimals={0} />
            </h3>
          </div>
        </div>

        {/* Upcoming income banner */}
        <div className="upcoming-banner flex justify-between items-center" onClick={() => setUpcomingOpen(true)}>
          <div className="flex items-center gap-2">
            <Clock size={16} color="#f59e0b" />
            <span className="text-sm font-medium" style={{ color: 'white' }}>
              {pendingCount > 0 ? `${pendingCount} ${t('home.upcomingPayments')}` : t('home.trackUpcoming')}
            </span>
          </div>
          <span className="text-sm font-medium flex items-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t('home.view')} <ChevronRight size={16} />
          </span>
        </div>

        <div className="section-title flex justify-between items-center mt-4">
          <h2 className="text-lg font-semibold">{t('home.transactions')}</h2>
        </div>

        <div className="transaction-list flex flex-col gap-3">
          {recentTransactions.length === 0 ? (
            <div className="empty-state flex flex-col items-center justify-center gap-2 py-8">
              <span style={{ fontSize: '2.5rem' }}>📭</span>
              <span className="text-sm text-muted">{t('home.noTransactions')}</span>
            </div>
          ) : (
            <AnimatePresence>
              {recentTransactions.map(tx => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative' }}
                >
                  <div style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%',
                    backgroundColor: '#ef4444', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px'
                  }}>
                    <Trash2 color="white" />
                  </div>
                  
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(e, { offset }) => {
                      if (offset.x < -80) {
                        if (navigator.vibrate) navigator.vibrate(50);
                        deleteTransaction(tx.id);
                      }
                    }}
                    className="transaction-item"
                    onClick={() => openModal(tx)}
                    style={{ cursor: 'pointer', position: 'relative', zIndex: 2, background: 'var(--color-surface)' }}
                  >
                    <div className="transaction-icon flex items-center justify-center bg-surface shadow-sm rounded-lg" style={{ width: '40px', height: '40px' }}>
                      {getIconForCategory(tx.category)}
                    </div>
                    <div className="transaction-details">
                      <h4 className="font-semibold">{t(`cat.${tx.category}`, { defaultValue: tx.category })}</h4>
                      <div className="flex items-center gap-1 flex-wrap">
                        {tx.tag && (
                          <span className="tx-mini-tag">{tx.tag}</span>
                        )}
                        {tx.note && (
                          <span className="text-xs text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>· {tx.note}</span>
                        )}
                        {!tx.tag && !tx.note && (
                          <span className="text-xs text-muted flex items-center gap-1">
                            <div style={{ width: '8px', height: '8px', backgroundColor: tx.type === 'expense' ? '#ef4444' : '#22c55e', borderRadius: '2px' }}></div>
                            {tx.account}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="transaction-amounts text-right">
                      <h4 className={`font-semibold ${tx.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                        {tx.type === 'expense' ? '-' : '+'}{formatAmount(tx.amount)}
                      </h4>
                      <span className="text-xs text-muted">{tx.date}</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <UpcomingSheet isOpen={upcomingOpen} onClose={() => setUpcomingOpen(false)} />
    </div>
  );
};

export default Home;
