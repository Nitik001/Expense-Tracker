import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useFinance } from '../context/FinanceContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './ImportModal.css';

// ── Smart parser for Indian bank statements ──
const BANK_PROFILES = {
  sbi: {
    name: 'SBI',
    dateCol: ['Txn Date', 'Value Date', 'Date'],
    descCol: ['Description', 'Narration', 'Particulars'],
    debitCol: ['Debit', 'Withdrawal', 'DR'],
    creditCol: ['Credit', 'Deposit', 'CR'],
  },
  hdfc: {
    name: 'HDFC',
    dateCol: ['Date', 'Txn Date'],
    descCol: ['Narration', 'Description', 'Particulars'],
    debitCol: ['Withdrawal Amt.', 'Withdrawal', 'Debit', 'DR'],
    creditCol: ['Deposit Amt.', 'Deposit', 'Credit', 'CR'],
  },
  icici: {
    name: 'ICICI',
    dateCol: ['Date', 'Transaction Date', 'Txn Date'],
    descCol: ['Particulars', 'Description', 'Narration', 'Mode'],
    debitCol: ['Withdrawals', 'Withdrawal', 'Debit', 'DR'],
    creditCol: ['Deposits', 'Deposit', 'Credit', 'CR'],
  },
  axis: {
    name: 'Axis',
    dateCol: ['Tran Date', 'Date', 'Transaction Date'],
    descCol: ['Particulars', 'Description', 'Narration'],
    debitCol: ['DR', 'Debit', 'Withdrawal'],
    creditCol: ['CR', 'Credit', 'Deposit'],
  },
  generic: {
    name: 'Generic',
    dateCol: ['Date', 'Txn Date', 'Transaction Date', 'Value Date', 'Tran Date', 'date'],
    descCol: ['Description', 'Narration', 'Particulars', 'Details', 'Remark', 'description', 'narration'],
    debitCol: ['Debit', 'Withdrawal', 'DR', 'Withdrawals', 'Withdrawal Amt.', 'debit'],
    creditCol: ['Credit', 'Deposit', 'CR', 'Deposits', 'Deposit Amt.', 'credit'],
    amountCol: ['Amount', 'amount', 'Transaction Amount'],
  }
};

const findColumn = (headers, candidates) => {
  for (const c of candidates) {
    const found = headers.find(h => h.toLowerCase().trim() === c.toLowerCase().trim());
    if (found) return found;
  }
  return null;
};

const parseDate = (raw) => {
  if (!raw) return null;
  const str = String(raw).trim();

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    const yr = dmy[3].length === 2 ? '20' + dmy[3] : dmy[3];
    return `${yr}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;
  }

  // YYYY-MM-DD
  const ymd = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (ymd) {
    return `${ymd[1]}-${ymd[2].padStart(2,'0')}-${ymd[3].padStart(2,'0')}`;
  }

  // Try JS Date parse as last resort
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  return null;
};

const parseAmount = (raw) => {
  if (raw === null || raw === undefined || raw === '') return 0;
  const cleaned = String(raw).replace(/[^0-9.\-]/g, '');
  return parseFloat(cleaned) || 0;
};

const guessCategory = (description) => {
  const desc = (description || '').toLowerCase();
  if (/salary|stipend|payroll/i.test(desc)) return 'Salary';
  if (/upi|neft|imps|rtgs/i.test(desc)) return 'Transfer';
  if (/swiggy|zomato|food|restaurant|hotel/i.test(desc)) return 'Food';
  if (/amazon|flipkart|myntra|shopping/i.test(desc)) return 'Shopping';
  if (/petrol|diesel|fuel|indian oil|hp |bharat/i.test(desc)) return 'Fuel';
  if (/recharge|jio|airtel|vodafone|vi |bsnl/i.test(desc)) return 'Recharge';
  if (/electricity|water|gas|bill|broadband|wifi/i.test(desc)) return 'Bills';
  if (/emi|loan|interest/i.test(desc)) return 'EMI';
  if (/medical|pharmacy|hospital|doctor/i.test(desc)) return 'Medical';
  if (/rent/i.test(desc)) return 'Rent';
  if (/atm|cash/i.test(desc)) return 'Cash';
  return 'Other';
};

const parseStatementData = (data) => {
  if (!data || data.length < 2) return { transactions: [], error: 'File appears empty or has no data rows.' };

  const headers = data[0].map(h => String(h || '').trim());
  const profile = BANK_PROFILES.generic;

  const dateKey = findColumn(headers, profile.dateCol);
  const descKey = findColumn(headers, profile.descCol);
  const debitKey = findColumn(headers, profile.debitCol);
  const creditKey = findColumn(headers, profile.creditCol);
  const amountKey = findColumn(headers, (profile.amountCol || []));

  if (!dateKey) {
    return { transactions: [], error: `Could not find a date column. Found columns: ${headers.join(', ')}` };
  }

  const transactions = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, idx) => { row[h] = data[i][idx]; });

    const date = parseDate(row[dateKey]);
    if (!date) continue;

    const description = descKey ? String(row[descKey] || '').trim() : '';
    let amount = 0;
    let type = 'expense';

    if (amountKey && !debitKey && !creditKey) {
      // Single amount column — negative = expense, positive = income
      amount = parseAmount(row[amountKey]);
      type = amount >= 0 ? 'income' : 'expense';
      amount = Math.abs(amount);
    } else {
      const debit = debitKey ? parseAmount(row[debitKey]) : 0;
      const credit = creditKey ? parseAmount(row[creditKey]) : 0;
      if (credit > 0) {
        type = 'income';
        amount = credit;
      } else if (debit > 0) {
        type = 'expense';
        amount = debit;
      } else {
        continue; // Skip rows with no amount
      }
    }

    if (amount <= 0) continue;

    transactions.push({
      date,
      amount,
      type,
      category: guessCategory(description),
      note: description.substring(0, 100),
      account: 'Bank',
      tag: '',
      source: 'import',
    });
  }

  return { transactions, error: null };
};

const ImportModal = ({ isOpen, onClose }) => {
  const { bulkAddTransactions } = useFinance();
  const { t } = useTranslation();
  const fileRef = useRef(null);

  const [step, setStep] = useState('upload'); // upload | preview | done
  const [parsedTxs, setParsedTxs] = useState([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [fileName, setFileName] = useState('');

  const reset = () => {
    setStep('upload');
    setParsedTxs([]);
    setError('');
    setImporting(false);
    setImportedCount(0);
    setFileName('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      const { transactions, error: parseError } = parseStatementData(data);

      if (parseError) {
        setError(parseError);
        return;
      }

      if (transactions.length === 0) {
        setError('No valid transactions found in this file. Please check the format.');
        return;
      }

      setParsedTxs(transactions);
      setStep('preview');
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to read file. Please make sure it is a valid CSV or Excel file.');
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      // Firestore writeBatch supports max 500 operations
      const chunks = [];
      for (let i = 0; i < parsedTxs.length; i += 450) {
        chunks.push(parsedTxs.slice(i, i + 450));
      }
      let total = 0;
      for (const chunk of chunks) {
        const count = await bulkAddTransactions(chunk);
        total += count;
      }
      setImportedCount(total);
      setStep('done');
    } catch (err) {
      console.error('Import failed:', err);
      setError('Failed to import transactions. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="import-overlay" onClick={handleClose}>
      <motion.div
        className="import-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
      >
        <div className="import-header">
          <h2>
            <FileSpreadsheet size={22} />
            Import Bank Statement
          </h2>
          <button className="import-close" onClick={handleClose}><X size={20} /></button>
        </div>

        {/* ── Step 1: Upload ── */}
        {step === 'upload' && (
          <div className="import-body">
            <div
              className="import-dropzone"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={40} strokeWidth={1.5} />
              <h3>Upload your statement</h3>
              <p>Supports CSV & Excel (.xlsx, .xls) from any Indian bank</p>
              <span className="import-hint">SBI · HDFC · ICICI · Axis · Kotak · any bank</span>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div className="import-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="import-instructions">
              <h4>How to get your statement:</h4>
              <ol>
                <li>Login to your bank's net banking</li>
                <li>Go to <strong>Account Statement</strong> or <strong>Transaction History</strong></li>
                <li>Select the date range you want</li>
                <li>Download as <strong>CSV</strong> or <strong>Excel</strong></li>
                <li>Upload the file here</li>
              </ol>
            </div>
          </div>
        )}

        {/* ── Step 2: Preview ── */}
        {step === 'preview' && (
          <div className="import-body">
            <div className="import-file-badge">
              <FileSpreadsheet size={16} />
              <span>{fileName}</span>
              <span className="import-count">{parsedTxs.length} transactions found</span>
            </div>

            <div className="import-preview-list">
              {parsedTxs.slice(0, 20).map((tx, i) => (
                <div key={i} className="import-preview-row">
                  <div className="import-preview-info">
                    <span className="import-preview-cat">{tx.category}</span>
                    <span className="import-preview-note">{tx.note || '—'}</span>
                  </div>
                  <div className="import-preview-right">
                    <span className={tx.type === 'expense' ? 'text-danger' : 'text-success'}>
                      {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </span>
                    <span className="import-preview-date">{tx.date}</span>
                  </div>
                </div>
              ))}
              {parsedTxs.length > 20 && (
                <div className="import-preview-more">
                  + {parsedTxs.length - 20} more transactions
                </div>
              )}
            </div>

            {error && (
              <div className="import-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="import-actions">
              <button className="import-btn-secondary" onClick={reset}>Back</button>
              <button className="import-btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? 'Importing...' : `Import ${parsedTxs.length} Transactions`}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 'done' && (
          <div className="import-body import-done">
            <CheckCircle size={56} color="#22c55e" strokeWidth={1.5} />
            <h3>Import Complete!</h3>
            <p>{importedCount} transactions imported successfully</p>
            <button className="import-btn-primary" onClick={handleClose}>Done</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ImportModal;
