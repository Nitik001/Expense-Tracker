import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X } from 'lucide-react';
import './TransactionModal.css';

const TransactionModal = () => {
  const { isModalOpen, closeModal, addTransaction } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('Cash');

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.submitter?.blur(); // prevent focusing issues
    e.preventDefault();
    if (!amount || !category) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      account,
      date: new Date().toISOString().split('T')[0]
    });
    
    setAmount('');
    setCategory('');
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button className="icon-btn-simple" onClick={closeModal}><X size={24} /></button>
        </div>

        <div className="tab-toggle mb-6">
          <button 
            className={`tab-btn ${type === 'expense' ? 'active' : ''}`}
            onClick={() => setType('expense')}
            type="button"
          >
            Expense
          </button>
          <button 
            className={`tab-btn ${type === 'income' ? 'active' : ''}`}
            onClick={() => setType('income')}
            type="button"
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="text-sm font-medium text-muted">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="form-input text-2xl font-bold"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">Category</label>
            <input 
              type="text" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              placeholder={type === 'expense' ? 'e.g. Groceries, Rent...' : 'e.g. Salary, Freelance...'}
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">Account</label>
            <select 
              value={account} 
              onChange={(e) => setAccount(e.target.value)}
              className="form-input"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>

          <button type="submit" className="btn-primary mt-4">Save Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
