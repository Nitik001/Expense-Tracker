import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFinance } from '../context/FinanceContext';
import { useTranslation } from 'react-i18next';
import { X, Trash2 } from 'lucide-react';
import './TransactionModal.css';

const ProjectModal = ({ isOpen, onClose, projectToEdit }) => {
  const { addProject, updateProject, deleteProject } = useFinance();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#9d7df2');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setColor(projectToEdit.color || '#9d7df2');
    } else {
      setName('');
      setColor('#9d7df2');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      color,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString()
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, data);
    } else {
      addProject(data);
    }

    onClose();
  };

  const handleDelete = () => {
    if (projectToEdit) {
      deleteProject(projectToEdit.id);
      onClose();
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {projectToEdit ? t('projects.editProject') : t('projects.addProject')}
          </h2>
          <button className="icon-btn-simple" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="text-sm font-medium text-muted">{t('projects.name')}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder={t('projects.placeholder')}
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-muted">{t('plan.colorTheme')}</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="form-input"
              style={{height: '50px', padding: '5px'}}
            />
          </div>

          <div className="flex gap-3 mt-4">
            {projectToEdit && (
               <button type="button" onClick={handleDelete} className="btn-secondary" style={{backgroundColor: '#fee2e2', color: '#ef4444'}}>
                 <Trash2 size={20} />
               </button>
            )}
            <button type="submit" className="btn-primary flex-1">
              {projectToEdit ? t('save', { defaultValue: 'Save' }) : t('create', { defaultValue: 'Create' })}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;
