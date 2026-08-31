import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronDown, BarChart2, PieChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import './Report.css';

const COLORS = ['#9d7df2', '#3b82f6', '#22c55e', '#ff7f50', '#e5e7eb', '#f59e0b', '#ef4444'];

const Report = () => {
  const [activeTab, setActiveTab] = useState('Expenses');
  const { transactions, formatAmount } = useFinance();
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const chartData = useMemo(() => {
    const filteredTx = transactions.filter(t => t.type === activeTab.toLowerCase());
    const categoryTotals = filteredTx.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    const total = filteredTx.reduce((sum, tx) => sum + tx.amount, 0);

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1),
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, activeTab]);

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="report-view animate-slide-up">
      <div className="page-header flex justify-between items-center">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Report</h2>
        <div className="date-pill">
          <span className="text-sm font-medium">{currentDate}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="tab-toggle-container">
        <div className="tab-toggle">
          <button 
            className={`tab-btn ${activeTab === 'Expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('Expenses')}
          >
            Expenses
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Income' ? 'active' : ''}`}
            onClick={() => setActiveTab('Income')}
          >
            Income
          </button>
        </div>
      </div>

      <div className="report-content">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Expenses Report</h3>
          <div className="flex gap-2">
            <div className="chart-toggle-btn"><BarChart2 size={16} color="var(--color-text-muted)" /></div>
            <div className="chart-toggle-btn active"><PieChart size={16} color="white" /></div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={chartData}
                  innerRadius="70%"
                  outerRadius="100%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
            <div className="chart-center-text">
              <span className="text-sm text-muted">Total {activeTab}</span>
              <h2 className="text-2xl font-bold">{formatAmount(totalAmount)}</h2>
            </div>
            {/* Tooltip mockup */}
            <div className="chart-tooltip">{chartData.length > 0 ? chartData[0].percentage + '%' : '0%'}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 mt-6">
          <span className="text-sm text-muted">All {activeTab}</span>
          <span className="text-sm text-muted">Total <span className="font-bold text-text">{formatAmount(totalAmount)}</span></span>
        </div>

        <div className="expense-list flex flex-col gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="expense-item bg-surface rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="expense-icon-small" style={{backgroundColor: `${item.color}20`}}>
                    <div className="dot" style={{backgroundColor: item.color}}></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <span className="text-xs text-muted">{item.percentage}% of total</span>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold">{formatAmount(item.value)}</h4>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{width: `${item.percentage}%`, backgroundColor: item.color}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
