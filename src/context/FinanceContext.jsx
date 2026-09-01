import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import {
  collection, doc, onSnapshot,
  addDoc, updateDoc, deleteDoc, setDoc, writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

// Helper: load from localStorage safely (for one-time migration)
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [upcomingItems, setUpcomingItems] = useState([]);
  const [projects, setProjects] = useState([]);

  const [currency, setCurrencyState] = useState('INR');
  const [theme, setThemeState] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [firestoreLoading, setFirestoreLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Month tracker state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Firestore real-time listeners ──
  useEffect(() => {
    if (!user) {
      // Clear state on sign-out
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setUpcomingItems([]);
      setProjects([]);
      return;
    }

    setFirestoreLoading(true);

    const uid = user.uid;
    const userRef = (sub) => collection(db, 'users', uid, sub);

    // One-time migration: push any localStorage data to Firestore
    const migrateLocalData = async () => {
      const migrationKey = `finance_migrated_${uid}`;
      if (localStorage.getItem(migrationKey)) return;

      const localTxs = loadFromStorage('finance_transactions', []);
      const localBudgets = loadFromStorage('finance_budgets', []);
      const localGoals = loadFromStorage('finance_goals', []);
      const localUpcoming = loadFromStorage('finance_upcoming', []);
      const localProjects = loadFromStorage('finance_projects', []);
      const localCurrency = loadFromStorage('finance_currency', 'INR');
      const localTheme = loadFromStorage('finance_theme', 'light');

      if (localTxs.length || localBudgets.length || localGoals.length || localUpcoming.length || localProjects.length) {
        const batch = writeBatch(db);
        localTxs.forEach(tx => {
          const { id, ...data } = tx;
          batch.set(doc(userRef('transactions')), data);
        });
        localBudgets.forEach(b => {
          const { id, ...data } = b;
          batch.set(doc(userRef('budgets')), data);
        });
        localGoals.forEach(g => {
          const { id, ...data } = g;
          batch.set(doc(userRef('goals')), data);
        });
        localUpcoming.forEach(u => {
          const { id, ...data } = u;
          batch.set(doc(userRef('upcoming')), data);
        });
        localProjects.forEach(p => {
          const { id, ...data } = p;
          batch.set(doc(userRef('projects')), data);
        });
        await batch.commit();

        // Save settings
        await setDoc(doc(db, 'users', uid, 'settings', 'prefs'), {
          currency: localCurrency,
          theme: localTheme,
        });

        // Clear localStorage after migration
        ['finance_transactions','finance_budgets','finance_goals',
         'finance_upcoming','finance_projects','finance_currency','finance_theme'].forEach(k => localStorage.removeItem(k));
      }
      localStorage.setItem(migrationKey, '1');
    };

    // Load settings
    const unsubSettings = onSnapshot(
      doc(db, 'users', uid, 'settings', 'prefs'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.currency) setCurrencyState(data.currency);
          if (data.theme) setThemeState(data.theme);
        }
      }
    );

    // Subscribe to collections
    const unsubTx = onSnapshot(userRef('transactions'), snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setFirestoreLoading(false);
    });
    const unsubBudgets = onSnapshot(userRef('budgets'), snap =>
      setBudgets(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsubGoals = onSnapshot(userRef('goals'), snap =>
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsubUpcoming = onSnapshot(userRef('upcoming'), snap =>
      setUpcomingItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsubProjects = onSnapshot(userRef('projects'), snap =>
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    // Run migration after subscriptions are set up
    migrateLocalData().catch(console.error);

    return () => {
      unsubSettings();
      unsubTx();
      unsubBudgets();
      unsubGoals();
      unsubUpcoming();
      unsubProjects();
    };
  }, [user]);

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
      month: 'long', year: 'numeric'
    });
  }, [selectedMonth]);

  // Filtered transactions for selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
    });
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => {
    return filteredTransactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  }, [filteredTransactions]);

  // ── Settings helpers ──
  const saveSettings = async (updates) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid, 'settings', 'prefs'), updates, { merge: true });
  };

  const setCurrency = async (val) => {
    setCurrencyState(val);
    await saveSettings({ currency: val });
  };

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    await saveSettings({ theme: next });
  };

  // ── Transaction CRUD ──
  const addTransaction = async (transaction) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'transactions'), transaction);
  };
  const updateTransaction = async (id, updatedTx) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'transactions', id), updatedTx);
  };
  const deleteTransaction = async (id) => {
    if (!user) return;
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;
    
    await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
    
    const toastId = Date.now();
    setToastMessage({
      id: toastId,
      message: 'Transaction deleted',
      onUndo: async () => {
        const { id: oldId, ...rest } = txToDelete;
        await addDoc(collection(db, 'users', user.uid, 'transactions'), rest);
        setToastMessage(null);
      }
    });
    
    setTimeout(() => {
      setToastMessage(prev => prev?.id === toastId ? null : prev);
    }, 5000);
  };

  // ── Budget CRUD ──
  const addBudget = async (budget) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'budgets'), budget);
  };
  const updateBudget = async (id, updated) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'budgets', id), updated);
  };
  const deleteBudget = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'budgets', id));
  };

  // ── Goal CRUD ──
  const addGoal = async (goal) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'goals'), goal);
  };
  const updateGoal = async (id, updated) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'goals', id), updated);
  };
  const deleteGoal = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
  };

  // ── Upcoming CRUD ──
  const addUpcoming = async (item) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'upcoming'), { ...item, received: false });
  };
  const markUpcomingReceived = async (id) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'upcoming', id), { received: true });
  };
  const deleteUpcoming = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'upcoming', id));
  };

  // ── Project CRUD ──
  const addProject = async (project) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'projects'), project);
  };
  const updateProject = async (id, updated) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'projects', id), updated);
  };
  const deleteProject = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'projects', id));
  };

  const clearAllData = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    [...transactions].forEach(tx => batch.delete(doc(db, 'users', user.uid, 'transactions', tx.id)));
    [...budgets].forEach(b => batch.delete(doc(db, 'users', user.uid, 'budgets', b.id)));
    [...goals].forEach(g => batch.delete(doc(db, 'users', user.uid, 'goals', g.id)));
    [...upcomingItems].forEach(u => batch.delete(doc(db, 'users', user.uid, 'upcoming', u.id)));
    [...projects].forEach(p => batch.delete(doc(db, 'users', user.uid, 'projects', p.id)));
    await batch.commit();
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
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <FinanceContext.Provider value={{
      // Data
      transactions, filteredTransactions, budgets, goals, upcomingItems, projects,
      firestoreLoading, totalIncome, totalExpense,
      toastMessage, setToastMessage,
      // Month navigation
      selectedMonth, selectedMonthLabel, goToPrevMonth, goToNextMonth,
      // CRUD
      addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      addGoal, updateGoal, deleteGoal,
      addUpcoming, markUpcomingReceived, deleteUpcoming,
      addProject, updateProject, deleteProject,
      clearAllData,
      // Settings
      currency, setCurrency,
      theme, toggleTheme,
      formatAmount,
      // Modal
      isModalOpen, openModal, closeModal, editingTransaction,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
