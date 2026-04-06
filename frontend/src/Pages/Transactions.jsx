import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions, deleteTransaction, createTransaction, reset } from '../features/transactions/transactionSlice';
import moment from 'moment';
import toast from 'react-hot-toast';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector((state) => state.transactions);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    date: moment().format('YYYY-MM-DD'),
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getTransactions());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  const filteredTransactions = transactions.filter((t) => {
    return (
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
      toast.success('Transaction deleted');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTransaction({ ...formData, amount: Number(formData.amount) }));
    toast.success('Transaction successfully added!');
    setShowModal(false);
    setFormData({
      amount: '',
      category: '',
      type: 'expense',
      date: moment().format('YYYY-MM-DD'),
      notes: ''
    });
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-secondary mb-2 font-medium">
            <span>Workspace</span>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <span className="text-primary">Transactions</span>
          </nav>
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-extrabold font-manrope text-on-surface tracking-tight">Transactions</h1>
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-secondary">Total: {transactions.length} Items</span>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg hover:bg-primary-container transition-all active:scale-95">
          <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
          Add Transaction
        </button>
      </div>

      {/* Filter & Search Bar Area */}
      <div className="bg-surface-container-lowest rounded-xl p-4 mb-8 shadow-[0px_4px_20px_rgba(25,27,35,0.03)] flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] flex items-center px-4 gap-3 bg-surface-container-low rounded-xl h-12">
          <span className="material-symbols-outlined text-outline" data-icon="search">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline/60 focus:outline-none" 
            placeholder="Search by category or description..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center font-bold text-secondary">Loading Transactions...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Date</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Category / Notes</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Type</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60 text-right">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-semibold text-on-surface">{moment(t.date).format('MMM DD, YYYY')}</p>
                      <p className="text-[10px] text-secondary">{moment(t.date).format('hh:mm A')}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface capitalize">{t.category}</span>
                        <span className="text-[11px] text-secondary">{t.notes || '—'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 ${t.type === 'income' ? 'text-[#008544]' : 'text-tertiary'}`}>
                        <span className={`material-symbols-outlined text-sm ${t.type === 'income' ? 'rotate-180' : ''}`} data-icon="arrow_outward">arrow_outward</span>
                        <span className="text-xs font-bold uppercase tracking-tight">{t.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`text-sm font-black font-manrope ${t.type === 'income' ? 'text-[#008544]' : 'text-on-surface'}`}>
                        {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleDelete(t._id)} className="p-2 text-outline hover:text-error transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-xl" data-icon="delete">delete</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-secondary font-medium">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
              <h3 className="text-xl font-bold font-manrope text-on-surface">Add Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1">Amount (€)</label>
                <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="0.00" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Housing, Food, Salary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1">Notes (Optional)</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Brief description" />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 hover:bg-surface-container-high rounded-xl font-bold text-sm text-secondary">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm shadow hover:bg-primary-container">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
