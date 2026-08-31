import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Trash2 } from 'lucide-react';
import './TransactionModal.css'; // Reusing modal styles

const PlanItemModal = ({ isOpen, onClose, type, itemToEdit }) => {
  const { addBudget, updateBudget, deleteBudget, addGoal, updateGoal, deleteGoal, currency } = useFinance();
  
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [color, setColor] = useState('#9d7df2');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setTarget(itemToEdit.target);
      setCurrent(itemToEdit.current);
      setColor(itemToEdit.color || '#9d7df2');
    } else {
      setName('');
      setTarget('');
      setCurrent('');
      setColor('#9d7df2');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target) return;

    const data = {
      name,
      target: parseFloat(target),
      current: current ? parseFloat(current) : 0,
      color
    };

    if (type === 'budget') {
      if (itemToEdit) updateBudget(itemToEdit.id, data);
      else addBudget(data);
    } else {
      if (itemToEdit) updateGoal(itemToEdit.id, data);
      else addGoal(data);
    }

    onClose();
  };

  const handleDelete = () => {
    if (itemToEdit) {
      if (type === 'budget') deleteBudget(itemToEdit.id);
      else deleteGoal(itemToEdit.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {itemToEdit ? `Edit ${type === 'budget' ? 'Budget' : 'Goal'}` : `Add ${type === 'budget' ? 'Budget' : 'Goal'}`}
          </h2>
          <button className="icon-btn-simple" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="text-sm font-medium text-muted">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder={`e.g. ${type === 'budget' ? 'Groceries' : 'New Car'}`}
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">Target Amount ({currencySymbol})</label>
            <input 
              type="number" 
              step="0.01"
              value={target} 
              onChange={(e) => setTarget(e.target.value)}
              className="form-input text-2xl font-bold"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">Current Saved/Spent ({currencySymbol})</label>
            <input 
              type="number" 
              step="0.01"
              value={current} 
              onChange={(e) => setCurrent(e.target.value)}
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">Color Theme</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="form-input"
              style={{height: '50px', padding: '5px'}}
            />
          </div>

          <div className="flex gap-3 mt-4">
            {itemToEdit && (
               <button type="button" onClick={handleDelete} className="btn-secondary" style={{backgroundColor: '#fee2e2', color: '#ef4444'}}>
                 <Trash2 size={20} />
               </button>
            )}
            <button type="submit" className="btn-primary flex-1">
              {itemToEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanItemModal;
