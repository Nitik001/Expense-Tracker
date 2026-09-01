import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Finance Tracker',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      create: 'Create',
      
      nav: {
        home: 'Home',
        report: 'Report',
        plan: 'Plan',
        settings: 'Settings'
      },
      
      home: {
        balance: 'Total Balance',
        income: 'Income',
        expenses: 'Expenses',
        recent: 'Recent Transactions',
        seeAll: 'See all',
        noTransactions: 'No transactions this month',
        greeting: 'Hello, ',
        upcomingPayments: 'upcoming payments',
        trackUpcoming: 'Track upcoming income',
        view: 'View',
        transactions: 'Transactions'
      },
      
      tx: {
        addExpense: 'Add Expense',
        addIncome: 'Add Income',
        editExpense: 'Edit Expense',
        editIncome: 'Edit Income',
        amount: 'Amount',
        category: 'Category',
        date: 'Date',
        note: 'Note (Optional)',
        expense: 'Expense',
        income: 'Income'
      },
      
      report: {
        title: 'Report',
        expenses: 'Expenses',
        income: 'Income',
        allExpenses: 'All Expenses',
        allIncome: 'All Income',
        total: 'Total',
        noData: 'No {{type}} in {{month}}',
        noTransactions: 'No transactions',
        ofTotal: 'of total'
      },
      
      plan: {
        title: 'Plan',
        goals: 'Goals',
        budgets: 'Budgets',
        addGoal: 'Add Goal',
        addBudget: 'Add Budget',
        editGoal: 'Edit Goal',
        editBudget: 'Edit Budget',
        name: 'Name',
        targetAmount: 'Target Amount',
        currentSaved: 'Current Saved',
        colorTheme: 'Color Theme',
        saved: 'Saved',
        spent: 'Spent',
        remaining: 'Remaining',
        overBudget: 'Over budget!',
        viewAll: 'View All',
        yourProgress: 'Your Progress',
        left: 'Left',
        goalAchieved: 'Goal Achieved! You did it!',
        goalOnTrack: "Keep saving, you're on track!",
        of: 'of'
      },
      
      settings: {
        title: 'Settings',
        account: 'Account',
        preferences: 'Preferences',
        appearance: 'Appearance',
        darkMode: 'Switch to Dark Mode',
        lightMode: 'Switch to Light Mode',
        currency: 'Currency',
        currencyDesc: 'Choose your display currency',
        language: 'Language',
        languageDesc: 'Choose your preferred language',
        about: 'About',
        version: 'Version',
        dataManagement: 'Data Management',
        clearData: 'Clear All Data',
        clearDataDesc: 'Delete all transactions & goals',
        signOut: 'Sign Out',
        signOutDesc: 'You can sign back in anytime',
        signOutConfirm: 'Sign out of Finance Tracker?',
        clearDataConfirm: 'Are you sure you want to delete all transactions, budgets, and goals? This cannot be undone.'
      },

      cat: {
        Food: 'Food',
        Transport: 'Transport',
        Shopping: 'Shopping',
        Bills: 'Bills',
        Health: 'Health',
        Entertainment: 'Entertainment',
        Education: 'Education',
        Other: 'Other',
        Salary: 'Salary',
        Freelance: 'Freelance',
        Gifts: 'Gifts',
        Investment: 'Investment'
      }
    }
  },
  hi: {
    translation: {
      appName: 'फ़ाइनेंस ट्रैकर',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      create: 'बनाएं',
      
      nav: {
        home: 'होम',
        report: 'रिपोर्ट',
        plan: 'योजना',
        settings: 'सेटिंग्स'
      },
      
      home: {
        balance: 'कुल शेष',
        income: 'आय',
        expenses: 'खर्च',
        recent: 'हाल के लेनदेन',
        seeAll: 'सभी देखें',
        noTransactions: 'इस महीने कोई लेनदेन नहीं',
        greeting: 'नमस्ते, ',
        upcomingPayments: 'आगामी भुगतान',
        trackUpcoming: 'आगामी आय ट्रैक करें',
        view: 'देखें',
        transactions: 'लेनदेन'
      },
      
      tx: {
        addExpense: 'खर्च जोड़ें',
        addIncome: 'आय जोड़ें',
        editExpense: 'खर्च संपादित करें',
        editIncome: 'आय संपादित करें',
        amount: 'राशि',
        category: 'श्रेणी',
        date: 'तारीख',
        note: 'नोट (वैकल्पिक)',
        expense: 'खर्च',
        income: 'आय'
      },
      
      report: {
        title: 'रिपोर्ट',
        expenses: 'खर्च',
        income: 'आय',
        allExpenses: 'सभी खर्च',
        allIncome: 'सभी आय',
        total: 'कुल',
        noData: '{{month}} में कोई {{type}} नहीं',
        noTransactions: 'कोई लेनदेन नहीं',
        ofTotal: 'कुल का'
      },
      
      plan: {
        title: 'योजना',
        goals: 'लक्ष्य',
        budgets: 'बजट',
        addGoal: 'लक्ष्य जोड़ें',
        addBudget: 'बजट जोड़ें',
        editGoal: 'लक्ष्य संपादित करें',
        editBudget: 'बजट संपादित करें',
        name: 'नाम',
        targetAmount: 'लक्ष्य राशि',
        currentSaved: 'वर्तमान बचत',
        colorTheme: 'रंग थीम',
        saved: 'बचत',
        spent: 'खर्च किया',
        remaining: 'शेष',
        overBudget: 'बजट से अधिक!',
        viewAll: 'सभी देखें',
        yourProgress: 'आपकी प्रगति',
        left: 'बाकी',
        goalAchieved: 'लक्ष्य प्राप्त हुआ! आपने कर दिखाया!',
        goalOnTrack: "बचत करते रहें, आप सही रास्ते पर हैं!",
        of: 'में से'
      },
      
      settings: {
        title: 'सेटिंग्स',
        account: 'खाता',
        preferences: 'प्राथमिकताएं',
        appearance: 'दिखावट',
        darkMode: 'डार्क मोड पर जाएं',
        lightMode: 'लाइट मोड पर जाएं',
        currency: 'मुद्रा',
        currencyDesc: 'अपनी प्रदर्शन मुद्रा चुनें',
        language: 'भाषा',
        languageDesc: 'अपनी पसंदीदा भाषा चुनें',
        about: 'के बारे में',
        version: 'संस्करण',
        dataManagement: 'डेटा प्रबंधन',
        clearData: 'सभी डेटा साफ़ करें',
        clearDataDesc: 'सभी लेनदेन और लक्ष्य हटाएं',
        signOut: 'साइन आउट',
        signOutDesc: 'आप कभी भी वापस साइन इन कर सकते हैं',
        signOutConfirm: 'फ़ाइनेंस ट्रैकर से साइन आउट करें?',
        clearDataConfirm: 'क्या आप वाकई सभी लेनदेन, बजट और लक्ष्य हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।'
      },

      cat: {
        Food: 'भोजन',
        Transport: 'परिवहन',
        Shopping: 'खरीदारी',
        Bills: 'बिल',
        Health: 'स्वास्थ्य',
        Entertainment: 'मनोरंजन',
        Education: 'शिक्षा',
        Other: 'अन्य',
        Salary: 'वेतन',
        Freelance: 'फ्रीलांस',
        Gifts: 'उपहार',
        Investment: 'निवेश'
      }
    }
  }
};

const savedLanguage = localStorage.getItem('finance_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
