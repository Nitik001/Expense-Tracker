import React, { createContext, useState, useContext } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [currency, setCurrency] = useState('INR');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Transaction CRUD
  const addTransaction = (transaction) => {
    setTransactions([
      ...transactions,
      { ...transaction, id: Date.now() }
    ]);
  };
  
  const updateTransaction = (id, updatedTx) => {
    setTransactions(transactions.map(tx => tx.id === id ? { ...updatedTx, id } : tx));
  };
  
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  // Budget CRUD
  const addBudget = (budget) => setBudgets([...budgets, { ...budget, id: `b${Date.now()}` }]);
  const updateBudget = (id, updated) => setBudgets(budgets.map(b => b.id === id ? { ...updated, id } : b));
  const deleteBudget = (id) => setBudgets(budgets.filter(b => b.id !== id));

  // Goal CRUD
  const addGoal = (goal) => setGoals([...goals, { ...goal, id: `g${Date.now()}` }]);
  const updateGoal = (id, updated) => setGoals(goals.map(g => g.id === id ? { ...updated, id } : g));
  const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
  };

  const openModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <FinanceContext.Provider value={{
      transactions, budgets, goals, currency, setCurrency, formatAmount,
      addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      addGoal, updateGoal, deleteGoal,
      clearAllData,
      isModalOpen, openModal, closeModal, editingTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
