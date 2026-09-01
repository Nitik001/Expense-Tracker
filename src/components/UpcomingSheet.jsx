import React, { useState } from 'react';
import { X, Plus, Check, Trash2, Clock, IndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import './UpcomingSheet.css';

const UpcomingSheet = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { upcomingItems, addUpcoming, markUpcomingReceived, deleteUpcoming, formatAmount, addTransaction } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    addUpcoming({ title, amount: parseFloat(amount), from, expectedDate });
    setTitle(''); setAmount(''); setFrom(''); setExpectedDate('');
    setShowForm(false);
  };

  const handleReceive = (item) => {
    // Mark received and create actual income transaction
    addTransaction({
      type: 'income',
      amount: item.amount,
      category: item.title,
      account: 'Bank Account',
      note: `Received from: ${item.from || 'Unknown'}`,
      tag: '👤 Friend',
      date: new Date().toISOString().split('T')[0],
    });
    markUpcomingReceived(item.id);
  };

  const pending  = upcomingItems.filter(i => !i.received);
  const received = upcomingItems.filter(i => i.received);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-slide-up upcoming-sheet">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold">{t('upcoming.title')}</h2>
            <p className="text-xs text-muted mt-1">{t('upcoming.subtitle')}</p>
          </div>
          <button className="icon-btn-simple" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Add Button / Form */}
        {!showForm ? (
          <button className="upcoming-add-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} /> {t('upcoming.addIncome')}
          </button>
        ) : (
          <form onSubmit={handleAdd} className="upcoming-form">
            <input className="form-input" placeholder={t('upcoming.whatIsIt')} value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="form-input" type="number" placeholder={t('upcoming.amount')} value={amount} onChange={e => setAmount(e.target.value)} required />
            <input className="form-input" placeholder={t('upcoming.fromWhom')} value={from} onChange={e => setFrom(e.target.value)} />
            <input className="form-input" type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
            <div className="flex gap-3">
              <button type="button" className="btn-secondary flex-1" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }} onClick={() => setShowForm(false)}>{t('cancel')}</button>
              <button type="submit" className="btn-primary flex-1">{t('upcoming.add')}</button>
            </div>
          </form>
        )}

        {/* Pending list */}
        {pending.length > 0 && (
          <div className="upcoming-section">
            <p className="section-mini-label">{t('upcoming.pending')} · {pending.length}</p>
            <div className="flex flex-col gap-3">
              {pending.map(item => (
                <div key={item.id} className="upcoming-card pending">
                  <div className="upcoming-card-icon">
                    <Clock size={18} color="var(--color-warning)" />
                  </div>
                  <div className="upcoming-card-info">
                    <h4 className="font-semibold">{item.title}</h4>
                    <span className="text-xs text-muted">
                      {item.from ? `${t('upcoming.from')}: ${item.from}` : t('upcoming.sourceNotSet')}
                      {item.expectedDate ? ` · ${t('upcoming.due')} ${item.expectedDate}` : ''}
                    </span>
                  </div>
                  <div className="upcoming-card-right">
                    <span className="font-bold text-success">{formatAmount(item.amount)}</span>
                    <div className="flex gap-1 mt-1">
                      <button
                        className="mini-btn green"
                        title="Mark as received"
                        onClick={() => handleReceive(item)}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="mini-btn red"
                        title="Delete"
                        onClick={() => deleteUpcoming(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Received list */}
        {received.length > 0 && (
          <div className="upcoming-section">
            <p className="section-mini-label">{t('upcoming.received')} ✓</p>
            <div className="flex flex-col gap-2">
              {received.map(item => (
                <div key={item.id} className="upcoming-card received">
                  <div className="upcoming-card-icon">
                    <Check size={18} color="var(--color-success)" />
                  </div>
                  <div className="upcoming-card-info">
                    <h4 className="font-semibold" style={{ opacity: 0.6 }}>{item.title}</h4>
                    <span className="text-xs text-muted">{item.from ? `${t('upcoming.from')}: ${item.from}` : ''}</span>
                  </div>
                  <div className="upcoming-card-right">
                    <span className="font-bold" style={{ opacity: 0.5 }}>{formatAmount(item.amount)}</span>
                    <button className="mini-btn red mt-1" onClick={() => deleteUpcoming(item.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && received.length === 0 && !showForm && (
          <div className="upcoming-empty">
            <span style={{ fontSize: '2.5rem' }}>💸</span>
            <p className="text-sm text-muted mt-2">{t('upcoming.noUpcoming')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSheet;
