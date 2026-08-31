import React, { useState } from 'react';
import { ChevronLeft, Plus, ExternalLink, MoreVertical, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import PlanItemModal from '../components/PlanItemModal';
import './Plan.css';

const Plan = () => {
  const { budgets, goals } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('goal'); // 'goal' or 'budget'
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setItemToEdit(item);
    setModalOpen(true);
  };

  return (
    <div className="plan-view animate-slide-up">
      <div className="page-header flex justify-between items-center mb-6">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold mr-auto ml-2">My Plan</h2>
        <div className="flex gap-3">
           <button className="icon-btn-solid bg-black text-white" onClick={() => handleOpenModal('goal')}><Plus size={18} /></button>
           <button className="icon-btn-simple"><ExternalLink size={20} /></button>
        </div>
      </div>

      <div className="section-title flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Goals</h3>
        <span className="text-sm text-muted">View All</span>
      </div>

      {goals.map(goal => {
        const percent = (goal.current / goal.target) * 100;
        return (
          <div key={goal.id} className="goal-card bg-surface rounded-lg p-5 shadow-md mb-8 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                  <div className="goal-icon">
                    <div className="inner-dot"></div>
                  </div>
                  <div>
                    <h4 className="font-bold">{goal.name}</h4>
                    <span className="text-xs text-muted">View All</span>
                  </div>
              </div>
              <button className="icon-btn-simple bg-background rounded-full p-1" onClick={() => handleOpenModal('goal', goal)}>
                <MoreVertical size={16} color="var(--color-text-muted)"/>
              </button>
            </div>

            <div className="mb-2">
              <h2 className="text-xl font-bold inline">${goal.current.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <span className="text-sm text-muted ml-1">Out of ${goal.target.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>

            <div className="goal-progress-container mb-2">
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{width: `${percent}%`}}>
                  <div className="progress-thumb"></div>
                </div>
              </div>
              <div className="goal-progress-overlay"></div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-muted">Your Progress</span>
              <span className="text-xs font-bold">${(goal.target - goal.current).toLocaleString()} Left</span>
            </div>

            <div className="alert-box">
              <AlertCircle size={14} />
              <span className="text-xs font-medium">You're 30% behind schedule and off target.</span>
            </div>
          </div>
        );
      })}

      <div className="section-title flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Budgets</h3>
        <button className="icon-btn-simple" onClick={() => handleOpenModal('budget')}><Plus size={16} /></button>
      </div>

      <div className="budget-list flex flex-col gap-4">
        {budgets.map(budget => {
          const percent = Math.min(100, Math.round((budget.current / budget.target) * 100));
          return (
            <div 
              key={budget.id} 
              className="budget-item bg-surface rounded-md p-4 shadow-sm flex items-center justify-between"
              onClick={() => handleOpenModal('budget', budget)}
              style={{cursor: 'pointer'}}
            >
              <div className="flex gap-3 items-center">
                <div className="budget-icon" style={{backgroundColor: `${budget.color}20`, color: budget.color}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="m3 8 9-5 9 5"/><path d="M12 22V8"/></svg>
                </div>
                <div>
                  <h4 className="font-semibold">{budget.name}</h4>
                  <span className="text-xs font-bold">${budget.current} <span className="text-muted font-normal">of ${budget.target}</span></span>
                </div>
              </div>
              <div className="circular-progress" style={{'--progress': percent, '--color': budget.color}}>
                  <span>{percent}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <PlanItemModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        type={modalType} 
        itemToEdit={itemToEdit} 
      />
    </div>
  );
};

export default Plan;
