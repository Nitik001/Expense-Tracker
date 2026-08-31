import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Trash2, Tag, FileText } from 'lucide-react';
import './TransactionModal.css';

const EXPENSE_TAGS = ['🏠 Rent', '🛒 Groceries', '🍕 Food', '⛽ Fuel', '💊 Health', '📱 Mobile', '🎮 Fun', '📚 Education', '👕 Clothes', '✈️ Travel', '💡 Utilities', '🎁 Gift'];
const INCOME_TAGS  = ['👤 Friend', '👨‍👩‍👧 Family', '💼 Work', '🏦 Bank', '💻 Freelance', '📦 Sale', '🏷️ Refund', '🎯 Bonus', '💰 Loan', '🤝 Client'];

const TransactionModal = () => {
  const {
    isModalOpen, closeModal,
    addTransaction, updateTransaction, deleteTransaction,
    editingTransaction, currency
  } = useFinance();

  const [type, setType]       = useState('expense');
  const [amount, setAmount]   = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('Cash');
  const [note, setNote]       = useState('');
  const [tag, setTag]         = useState('');
  const [date, setDate]       = useState(() => new Date().toISOString().split('T')[0]);

  const currencySymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const availableTags  = type === 'expense' ? EXPENSE_TAGS : INCOME_TAGS;

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setAccount(editingTransaction.account);
      setNote(editingTransaction.note || '');
      setTag(editingTransaction.tag || '');
      setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setAccount('Cash');
      setNote('');
      setTag('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingTransaction, isModalOpen]);

  if (!isModalOpen) return null;

  const handleTagClick = (t) => {
    setTag(prev => prev === t ? '' : t);           // toggle
    if (!category) setCategory(t.split(' ').slice(1).join(' ')); // auto-fill category from tag
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const txData = { type, amount: parseFloat(amount), category, account, note, tag, date };

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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-content animate-slide-up">
        {/* Header */}
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="icon-btn-simple" onClick={closeModal}><X size={24} /></button>
        </div>

        {/* Type Toggle */}
        <div className="tab-toggle mb-5">
          <button className={`tab-btn ${type === 'expense' ? 'active' : ''}`} onClick={() => setType('expense')} type="button">
            Expense
          </button>
          <button className={`tab-btn ${type === 'income' ? 'active' : ''}`} onClick={() => setType('income')} type="button">
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount ({currencySymbol})</label>
            <input
              type="number" step="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input text-2xl font-bold" placeholder="0.00" required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text" value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              placeholder={type === 'expense' ? 'e.g. Groceries, Rent…' : 'e.g. Salary, Freelance…'}
              required
            />
          </div>

          {/* Quick Tags */}
          <div className="form-group">
            <label className="form-label flex items-center gap-1"><Tag size={13} /> Quick Tag <span className="text-xs text-muted">(tap to select)</span></label>
            <div className="tag-grid">
              {availableTags.map(t => (
                <button
                  key={t} type="button"
                  className={`tag-chip ${tag === t ? 'active' : ''}`}
                  onClick={() => handleTagClick(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label flex items-center gap-1"><FileText size={13} />
              {type === 'expense' ? 'Where did this go?' : 'Where is this coming from?'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input form-textarea"
              placeholder={type === 'expense'
                ? 'e.g. Paid rent to landlord, Birthday dinner with friends…'
                : 'e.g. Salary from company, Loan from Rahul, Sold old laptop…'}
              rows={2}
            />
          </div>

          {/* Account & Date side by side */}
          <div className="flex gap-3">
            <div className="form-group flex-1">
              <label className="form-label">Account</label>
              <select value={account} onChange={(e) => setAccount(e.target.value)} className="form-input">
                <option value="Cash">Cash</option>
                <option value="Bank Account">Bank Account</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            {editingTransaction && (
              <button type="button" onClick={handleDelete} className="btn-secondary btn-danger-soft">
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
