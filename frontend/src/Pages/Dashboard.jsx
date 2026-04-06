import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, reset } from '../features/dashboard/dashboardSlice';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import moment from 'moment';

const PIE_COLORS = ['#003d9b', '#4f6169', '#b2c5ff', '#c3c6d6', '#a33500'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summary, recentActivity, categoryTotals, monthlyTrends, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  if (isLoading || !summary) {
    return <div className="p-10 text-center font-bold text-secondary">Loading Dashboard...</div>;
  }

  const chartDataMap = {};
  monthlyTrends.forEach((trend) => {
    const key = `${trend.year}-${String(trend.month).padStart(2, '0')}`;
    if (!chartDataMap[key]) chartDataMap[key] = { name: key, balance: 0, income: 0, expense: 0 };
    if (trend.type === 'income') chartDataMap[key].income += trend.total;
    if (trend.type === 'expense') chartDataMap[key].expense += trend.total;
    // Calculate net trend balance map incrementally
    chartDataMap[key].balance = chartDataMap[key].income - chartDataMap[key].expense;
  });
  const lineData = Object.values(chartDataMap).sort((a,b) => a.name.localeCompare(b.name));

  const pieData = categoryTotals.map((cat) => ({
    name: cat._id,
    value: cat.total,
  }));

  return (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold font-manrope tracking-tight text-primary">Dashboard Overview</h2>
        <p className="text-secondary font-inter mt-1">Real-time synthesis of your strategic capital and growth metrics.</p>
      </div>

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between mb-6">
            <span className="p-3 bg-primary/10 text-primary rounded-xl">
              <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">Primary Ledger</span>
          </div>
          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-manrope font-extrabold text-on-surface">₹{summary.netBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] group hover:scale-[1.01] transition-all border-l-4 border-primary">
          <div className="flex items-center justify-between mb-6">
            <span className="p-3 bg-green-50 text-green-600 rounded-xl">
              <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">Inflow</span>
          </div>
          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Total Income</p>
          <h3 className="text-4xl font-manrope font-extrabold text-on-surface">+₹{summary.totalIncome?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
        </div>

        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] group hover:scale-[1.01] transition-all">
          <div className="flex items-center justify-between mb-6">
            <span className="p-3 bg-red-50 text-red-600 rounded-xl">
              <span className="material-symbols-outlined" data-icon="payments">payments</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">Outflow</span>
          </div>
          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Total Expenses</p>
          <h3 className="text-4xl font-manrope font-extrabold text-on-surface">-₹{summary.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-[0px_12px_32px_rgba(25,27,35,0.06)] relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-manrope font-extrabold text-lg">Balance Trend</h4>
              <p className="text-xs text-secondary">Capital flow visualization</p>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[250px]">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2e3038', color: '#f0f0fb', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', fontSize: '10px' }}
                    itemStyle={{ color: '#f0f0fb' }}
                  />
                  <XAxis dataKey="name" stroke="#737685" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4f6169', fontWeight: 'bold' }} dy={10} />
                  <Line type="monotone" dataKey="balance" stroke="#003d9b" strokeWidth={4} dot={{ fill: '#003d9b', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-secondary font-bold opacity-50">No Trend Data Available</div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-surface-container-lowest rounded-xl p-8 shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
            <h4 className="font-manrope font-extrabold text-lg mb-6">Spending Breakdown</h4>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 mb-8 flex justify-center items-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={0} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full rounded-full border-4 border-outline/20"></div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-secondary">CATS</span>
                  <span className="text-sm font-extrabold">{pieData.length}</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {pieData.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div>
                      <span className="font-medium capitalize">{cat.name}</span>
                    </div>
                    <span className="font-bold">₹{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {pieData.length === 0 && <div className="text-center text-secondary opacity-50 text-xs">No Data</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-surface-container-lowest rounded-xl p-8 shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-manrope font-extrabold text-lg">Recent Transactions</h4>
        </div>
        <div className="space-y-1">
          {recentActivity.length > 0 ? recentActivity.map((transaction) => (
             <div key={transaction._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${transaction.type === 'income' ? 'bg-primary/10' : 'bg-secondary-container'} rounded-full flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${transaction.type === 'income' ? 'text-primary' : 'text-on-secondary-container'}`} data-icon="payments">payments</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface capitalize">{transaction.category}</p>
                  <p className="text-[10px] text-secondary font-medium">{transaction.notes || 'No description'} • {moment(transaction.date).fromNow()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${transaction.type === 'income' ? 'text-primary' : 'text-on-surface'}`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-green-600 font-bold">Cleared</p>
              </div>
            </div>
          )) : (
            <div className="text-center text-sm font-bold opacity-50 p-4">No recent transactions to display.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
