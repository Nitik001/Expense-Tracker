import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFinance } from '../context/FinanceContext';
import ProjectModal from '../components/ProjectModal';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const Projects = () => {
  const { projects, transactions, formatAmount } = useFinance();
  const { t } = useTranslation();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const handleOpenModal = (project = null) => {
    setProjectToEdit(project);
    setModalOpen(true);
  };

  const getProjectStats = (projectId) => {
    const projectTxs = transactions.filter(tx => tx.projectId === projectId);
    const income = projectTxs.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const expense = projectTxs.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    return {
      income,
      expense,
      net: income - expense,
      txs: projectTxs.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
  };

  return (
    <div className="projects-view animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold mr-auto ml-2">{t('projects.title')}</h2>
        <button className="icon-btn-solid bg-black text-white" onClick={() => handleOpenModal()}>
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <Briefcase size={48} className="mb-4" />
            <p>{t('projects.noProjects')}</p>
          </div>
        ) : (
          projects.map(project => {
            const stats = getProjectStats(project.id);
            const isExpanded = expandedProject === project.id;

            return (
              <div key={project.id} className="bg-surface rounded-xl p-5 shadow-sm" style={{ borderLeft: `4px solid ${project.color || '#9d7df2'}` }}>
                <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedProject(isExpanded ? null : project.id)}>
                  <div className="flex gap-3 items-center">
                    <div className="p-3 rounded-full" style={{ backgroundColor: `${project.color}20`, color: project.color }}>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{project.name}</h3>
                      <p className="text-xs text-muted mt-1">{t('projects.netProfit')}: <span className={stats.net >= 0 ? 'text-success' : 'text-danger font-bold'}>{formatAmount(stats.net)}</span></p>
                    </div>
                  </div>
                  <button className="icon-btn-simple" onClick={(e) => { e.stopPropagation(); handleOpenModal(project); }}>
                    <MoreVertical size={20} className="text-muted" />
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted flex items-center gap-1"><TrendingUp size={12} className="text-success" /> {t('projects.income')}</span>
                            <span className="font-semibold text-sm">{formatAmount(stats.income)}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted flex items-center gap-1"><TrendingDown size={12} className="text-danger" /> {t('projects.expense')}</span>
                            <span className="font-semibold text-sm">{formatAmount(stats.expense)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
                          {stats.txs.length > 0 ? (
                            stats.txs.map(tx => (
                              <div key={tx.id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-background/50">
                                <div>
                                  <p className="text-sm font-medium">{tx.description || t(`cat.${tx.category}`, { defaultValue: tx.category })}</p>
                                  <p className="text-xs text-muted">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-success' : 'text-text'}`}>
                                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                               </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-xs text-muted py-2">No transactions</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      <ProjectModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        projectToEdit={projectToEdit} 
      />
    </div>
  );
};

export default Projects;
