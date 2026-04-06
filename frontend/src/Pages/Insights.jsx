import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
import { BarChart, Bar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Insights = () => {
  const dispatch = useDispatch();
  const { summary, categoryTotals, monthlyTrends, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading || !summary) {
    return <div className="p-10 text-center font-bold text-secondary">Loading Insights...</div>;
  }

  const barData = categoryTotals.map((cat) => ({
    name: cat.category,
    Total: cat.total,
  }));

  const highestCategory = categoryTotals.length > 0 
    ? categoryTotals.reduce((prev, current) => (prev.total > current.total) ? prev : current)
    : { category: 'None', total: 0 };

  const chartDataMap = {};
  monthlyTrends?.forEach((trend) => {
    const key = `${trend.year}-${String(trend.month).padStart(2, '0')}`;
    if (!chartDataMap[key]) chartDataMap[key] = { name: key, balance: 0, income: 0, expense: 0 };
    if (trend.type === 'income') chartDataMap[key].income += trend.total;
    if (trend.type === 'expense') chartDataMap[key].expense += trend.total;
    chartDataMap[key].balance = chartDataMap[key].income - chartDataMap[key].expense;
  });
  const lineData = Object.values(chartDataMap).sort((a,b) => a.name.localeCompare(b.name));

  const totalProcessed = summary.totalTransactions || 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex flex-col justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface mb-2">Insights</h1>
          <p className="text-secondary font-inter font-medium opacity-80">Performance Analysis Based on Current Data</p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Highlight Card 1 */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <h3 className="text-secondary font-manrope font-bold text-sm uppercase tracking-widest mb-2">Highest Spending Category</h3>
            <p className="text-3xl font-manrope font-extrabold text-on-surface mb-1 capitalize">{highestCategory.category}</p>
            <p className="text-xl font-manrope font-bold text-primary">₹{highestCategory.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[12rem]">analytics</span>
          </div>
        </div>

        {/* Highlight Card 2 */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            </div>
            <h3 className="text-secondary font-manrope font-bold text-sm uppercase tracking-widest mb-2">Aggregated Net Balance</h3>
            <p className="text-3xl font-manrope font-extrabold text-on-surface mb-1">
               {summary.netBalance >= 0 ? '+' : '-'}₹{Math.abs(summary.netBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm font-manrope font-bold text-secondary">From {totalProcessed} Transactions</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[12rem]">account_balance</span>
          </div>
        </div>

        {/* Highlight Card 3 */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#008544]/10 text-[#008544] flex items-center justify-center mb-6">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>data_saver_on</span>
            </div>
            <h3 className="text-secondary font-manrope font-bold text-sm uppercase tracking-widest mb-2">Volume vs Run Rate</h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-secondary font-bold uppercase tracking-wider mb-1">Total Inflow</p>
                <p className="text-xl font-manrope font-extrabold text-[#008544] mb-1">₹{(summary.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary font-bold uppercase tracking-wider mb-1">Total Outflow</p>
                <p className="text-xl font-manrope font-extrabold text-on-surface mb-1">₹{(summary.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="col-span-12 xl:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-manrope font-extrabold text-on-surface">Spending Comparison By Category</h3>
              <p className="text-sm text-secondary font-inter">Breakdown of accumulated lifetime transactions</p>
            </div>
          </div>
          
          <div className="w-full h-64 relative">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barCategoryGap="20%">
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2e3038', color: '#f0f0fb', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', fontSize: '10px' }}
                    itemStyle={{ color: '#f0f0fb' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <XAxis dataKey="name" stroke="#737685" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4f6169', fontWeight: 'bold', textTransform: 'uppercase' }} dy={10} />
                  <Bar dataKey="Total" fill="#003d9b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-secondary font-bold opacity-50">No Data Available</div>
             )}
          </div>
        </div>

        {/* Line Chart */}
         <div className="col-span-12 xl:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-manrope font-extrabold text-on-surface">Income vs Expense Trends</h3>
              <p className="text-sm text-secondary font-inter">Time series volume mapping</p>
            </div>
          </div>
          
          <div className="w-full h-64 relative">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2e3038', color: '#f0f0fb', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', fontSize: '10px' }}
                    itemStyle={{ color: '#f0f0fb' }}
                  />
                  <XAxis dataKey="name" stroke="#737685" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4f6169', fontWeight: 'bold' }} dy={10} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#008544" strokeWidth={4} dot={{ fill: '#008544', r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expense" name="Expense" stroke="#003d9b" strokeWidth={4} dot={{ fill: '#003d9b', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-secondary font-bold opacity-50">No Trend Data Available</div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;
