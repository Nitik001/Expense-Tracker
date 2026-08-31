import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Trash2 } from 'lucide-react';
import './TransactionModal.css';

const TransactionModal = () => {
  const { isModalOpen, closeModal, addTransaction, updateTransaction, deleteTransaction, editingTransaction, currency } = useFinance();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('Cash');

  const currencySymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setAccount(editingTransaction.account);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setAccount('Cash');
    }
  }, [editingTransaction, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.submitter?.blur(); // prevent focusing issues
    e.preventDefault();
    if (!amount || !category) return;

    const txData = {
      type,
      amount: parseFloat(amount),
      category,
      account,
      date: editingTransaction ? editingTransaction.date : new Date().toISOString().split('T')[0]
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, txData);
    } else {
      addTransaction(txData);
    }
    
    closeModal();
  };

  const handleDelete = () => {
    if (editingTransaction) {
      deleteTransaction(editingTransaction.id);
      closeModal();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
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
            <label className="text-sm font-medium text-muted">Amount ({currencySymbol})</label>
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

          <div className="flex gap-3 mt-4">
            {editingTransaction && (
               <button type="button" onClick={handleDelete} className="btn-secondary" style={{backgroundColor: '#fee2e2', color: '#ef4444'}}>
                 <Trash2 size={20} />
               </button>
            )}
            <button type="submit" className="btn-primary flex-1">
              {editingTransaction ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
