import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);

  const [currency, setCurrency] = useState('INR');
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Month tracker state — tracks which month is selected for filtering
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() }; // 0-indexed month
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Navigate months
  const goToPrevMonth = () => {
    setSelectedMonth(prev => {
      const d = new Date(prev.year, prev.month - 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth(prev => {
      const d = new Date(prev.year, prev.month + 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const selectedMonthLabel = useMemo(() => {
    return new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [selectedMonth]);

  // Transactions filtered to selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
    });
  }, [transactions, selectedMonth]);

  // Transaction CRUD
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now() }]);
  };

  const updateTransaction = (id, updatedTx) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...updatedTx, id } : tx));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Budget CRUD
  const addBudget = (budget) => setBudgets(prev => [...prev, { ...budget, id: `b${Date.now()}` }]);
  const updateBudget = (id, updated) => setBudgets(prev => prev.map(b => b.id === id ? { ...updated, id } : b));
  const deleteBudget = (id) => setBudgets(prev => prev.filter(b => b.id !== id));

  // Goal CRUD
  const addGoal = (goal) => setGoals(prev => [...prev, { ...goal, id: `g${Date.now()}` }]);
  const updateGoal = (id, updated) => setGoals(prev => prev.map(g => g.id === id ? { ...updated, id } : g));
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

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
      // Data
      transactions, filteredTransactions, budgets, goals,
      // Month navigation
      selectedMonth, selectedMonthLabel, goToPrevMonth, goToNextMonth,
      // CRUD
      addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      addGoal, updateGoal, deleteGoal,
      clearAllData,
      // Settings
      currency, setCurrency,
      theme, toggleTheme,
      formatAmount,
      // Modal
      isModalOpen, openModal, closeModal, editingTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
