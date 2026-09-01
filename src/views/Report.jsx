import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, BarChart2, PieChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Sector, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import './Report.css';

const COLORS = ['#9d7df2', '#3b82f6', '#22c55e', '#ff7f50', '#e5e7eb', '#f59e0b', '#ef4444'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" fontSize={18} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={14}>
        {payload.percentage}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const Report = () => {
  const [activeTab, setActiveTab] = useState('Expenses');
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartType, setChartType] = useState('pie');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const {
    filteredTransactions,
    formatAmount,
    selectedMonthLabel,
    goToPrevMonth,
    goToNextMonth,
    selectedMonth,
  } = useFinance();

  const now = new Date();
  const isCurrentMonth =
    selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth();

  const chartData = useMemo(() => {
    const type = activeTab === 'Expenses' ? 'expense' : 'income';
    const filteredTx = filteredTransactions.filter(t => t.type === type);
    const categoryTotals = filteredTx.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    const total = filteredTx.reduce((sum, tx) => sum + tx.amount, 0);

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0.0',
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, activeTab]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="report-view animate-slide-up">
      <div className="page-header flex justify-between items-center">
        <button className="icon-btn-simple"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Report</h2>

        {/* Month navigator */}
        <div className="flex items-center gap-2">
          <button className="icon-btn-simple" onClick={goToPrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium" style={{ minWidth: '110px', textAlign: 'center' }}>
            {selectedMonthLabel}
          </span>
          <button
            className="icon-btn-simple"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
          >
            <ChevronRight size={18} />
          </button>
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
          <h3 className="font-semibold text-lg">{activeTab} Report</h3>
          <div className="flex gap-2">
            <div 
              className={`chart-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
              style={{cursor: 'pointer'}}
            >
              <BarChart2 size={16} color={chartType === 'bar' ? 'white' : 'var(--color-text-muted)'} />
            </div>
            <div 
              className={`chart-toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
              onClick={() => setChartType('pie')}
              style={{cursor: 'pointer'}}
            >
              <PieChart size={16} color={chartType === 'pie' ? 'white' : 'var(--color-text-muted)'} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-inner">
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2" style={{ height: '100%' }}>
                <span style={{ fontSize: '2.5rem' }}>📊</span>
                <span className="text-sm text-muted">No {activeTab.toLowerCase()} in {selectedMonthLabel}</span>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <RechartsPie>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={chartData}
                        innerRadius="65%"
                        outerRadius="85%"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                        onClick={onPieEnter}
                        onMouseEnter={onPieEnter}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPie>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-text-muted)'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-text-muted)'}} />
                      <Tooltip 
                        cursor={{fill: 'var(--color-surface-2)'}}
                        contentStyle={{backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: '12px', boxShadow: 'var(--shadow-md)'}}
                        formatter={(value) => formatAmount(value)}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 mt-6">
          <span className="text-sm text-muted">All {activeTab}</span>
          <span className="text-sm text-muted">Total <span className="font-bold text-text">{formatAmount(totalAmount)}</span></span>
        </div>

        <div className="expense-list flex flex-col gap-4">
          {chartData.map((item) => {
            const isExpanded = expandedCategory === item.name;
            const categoryTransactions = filteredTransactions.filter(
              t => t.type === (activeTab === 'Expenses' ? 'expense' : 'income') && t.category === item.name
            );
            
            return (
              <div 
                key={item.name} 
                className="expense-item bg-surface rounded-md p-4 shadow-sm"
                onClick={() => setExpandedCategory(isExpanded ? null : item.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="expense-icon-small" style={{ backgroundColor: `${item.color}20` }}>
                      <div className="dot" style={{ backgroundColor: item.color }}></div>
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
                  <div className="progress-bar-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                        {categoryTransactions.length > 0 ? (
                          categoryTransactions.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center text-sm py-1">
                              <div>
                                <p className="font-medium">{tx.description || tx.category}</p>
                                <p className="text-xs text-muted">{new Date(tx.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                              </div>
                              <span className="font-semibold">{formatAmount(tx.amount)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted text-center py-2">No transactions</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Report;
