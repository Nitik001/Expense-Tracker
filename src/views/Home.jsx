import React from 'react';
import { Bell, ChevronDown, TrendingUp, TrendingDown, Coffee, CreditCard, Sparkles, ChevronRight, Briefcase, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import './Home.css';

const Home = () => {
  const { transactions, openModal } = useFinance();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  
  // Get recent transactions, sorted by ID (descending)
  const recentTransactions = [...transactions].sort((a, b) => b.id - a.id).slice(0, 5);

  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'groceries': return <CreditCard size={20} color="#9d7df2" />;
      case 'clothing & shoes': return <Briefcase size={20} color="#3b82f6" />;
      case 'dining':
      case 'cafes': return <Coffee size={20} color="#22c55e" />;
      case 'salary': return <TrendingUp size={20} color="#ff7f50" />;
      default: return <Plus size={20} color="#9d7df2" />;
    }
  };
  return (
    <div className="home-view animate-slide-up">
      <div className="home-header">
        <div className="header-top flex justify-between items-center">
          <div className="profile-image">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" />
            <div className="notification-badge"></div>
          </div>
          
          <div className="glass-pill date-selector">
            <span className="text-sm font-medium">November 2025</span>
            <ChevronDown size={16} />
          </div>

          <div className="icon-btn header-icon">
            <Bell size={20} color="#fff" />
            <div className="notification-dot"></div>
          </div>
        </div>

        <div className="balance-section flex flex-col items-center gap-2">
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Current Balance</span>
          <h1 className="text-4xl font-bold" style={{ color: 'white' }}>${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h1>
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>+$784 than last week</span>
        </div>
      </div>

      <div className="home-content">
        <div className="section-title flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Money <span className="info-icon">i</span></h2>
          <span className="text-sm text-muted flex items-center">Details <ChevronRight size={16} /></span>
        </div>

        <div className="money-cards flex gap-4">
          <div className="money-card">
            <div className="card-icon income-icon">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-muted">Income <span className="info-icon">i</span></span>
            <h3 className="text-xl font-bold">${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
          <div className="money-card">
            <div className="card-icon expense-icon">
              <TrendingDown size={20} />
            </div>
            <span className="text-sm text-muted">Expenses <span className="info-icon">i</span></span>
            <h3 className="text-xl font-bold">${totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="insight-banner flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={16} color="#A88BEB" />
            <span className="text-sm font-medium" style={{ color: 'white' }}>Your insight is ready</span>
          </div>
          <span className="text-sm font-medium flex items-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Get Pro <ChevronRight size={16} />
          </span>
        </div>

        <div className="section-title flex justify-between items-center mt-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <div className="flex items-center gap-3">
             <span className="text-sm text-muted">For the Period</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Recent</span>
            <span className="text-xs text-muted">Total <span className="font-bold text-text">${(totalIncome + totalExpense).toLocaleString('en-US', {maximumFractionDigits: 0})}</span></span>
        </div>

        <div className="transaction-list flex flex-col gap-3">
          {recentTransactions.map(tx => (
            <div 
              key={tx.id} 
              className="transaction-item"
              onClick={() => openModal(tx)}
              style={{cursor: 'pointer'}}
            >
              <div className="transaction-icon flex items-center justify-center bg-surface shadow-sm rounded-lg" style={{width: '40px', height: '40px'}}>
                {getIconForCategory(tx.category)}
              </div>
              <div className="transaction-details">
                <h4 className="font-semibold">{tx.category}</h4>
                <span className="text-xs text-muted flex items-center gap-1">
                   <div style={{width:'8px', height:'8px', backgroundColor: tx.type === 'expense' ? '#ef4444' : '#22c55e', borderRadius:'2px'}}></div> {tx.account}
                </span>
              </div>
              <div className="transaction-amounts text-right">
                <h4 className={`font-semibold ${tx.type === 'expense' ? 'text-danger' : 'text-success'}`}>
                  {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </h4>
                <span className="text-xs text-muted">{tx.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
