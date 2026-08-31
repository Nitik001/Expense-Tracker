import React, { createContext, useState, useContext } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', category: 'Groceries', amount: 8750.00, date: '2026-01-12', account: 'Cash, EUR' },
    { id: 2, type: 'expense', category: 'Clothing & Shoes', amount: 6420.35, date: '2026-01-12', account: 'Red Card' },
    { id: 3, type: 'expense', category: 'Dining', amount: 2500.00, date: '2026-01-10', account: 'Cafes' },
    { id: 4, type: 'expense', category: 'Travel', amount: 1500.00, date: '2026-01-08', account: 'Vacation' },
    { id: 5, type: 'expense', category: 'Other', amount: 920.00, date: '2026-01-05', account: 'Cash, EUR' },
    { id: 6, type: 'income', category: 'Salary', amount: 4875.12, date: '2026-01-01', account: 'Main Account' },
  ]);

  const [budgets, setBudgets] = useState([
    { id: 'b1', name: 'Save for a Car', current: 2500, target: 7500, color: '#ff7f50' },
    { id: 'b2', name: 'Save for Education', current: 500, target: 2500, color: '#9d7df2' },
    { id: 'b3', name: 'Vacation fund', current: 750, target: 5000, color: '#3b82f6' },
    { id: 'b4', name: 'Health Savings', current: 1200, target: 3000, color: '#22c55e' },
  ]);

  const [goals, setGoals] = useState([
    { id: 'g1', name: 'House by the Sea', current: 1000, target: 1750, color: '#ff7f50' }
  ]);

  const [currency, setCurrency] = useState('USD');
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

  return (
    <FinanceContext.Provider value={{
      transactions, budgets, goals, currency, setCurrency,
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
