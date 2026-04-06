import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 h-full bg-surface-container-low dark:bg-slate-950 flex flex-col py-8 px-4 gap-y-6 z-50 shadow-[4px_0_24px_rgba(25,27,35,0.02)]">
      <div className="flex flex-col items-start px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" data-icon="architecture">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-black font-manrope text-primary dark:text-blue-400 leading-none">Fiscal Architect</h1>
          </div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-y-2">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 font-inter text-sm transition-all rounded-xl ${isActive ? 'text-primary bg-surface-container-lowest font-semibold shadow-sm translate-x-1 duration-200' : 'text-secondary hover:text-primary font-medium'}`}
        >
          <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/transactions" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 font-inter text-sm transition-all rounded-xl ${isActive ? 'text-primary bg-surface-container-lowest font-semibold shadow-sm translate-x-1 duration-200' : 'text-secondary hover:text-primary font-medium'}`}
        >
          <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
          <span>Transactions</span>
        </NavLink>
        <NavLink 
          to="/insights" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 font-inter text-sm transition-all rounded-xl ${isActive ? 'text-primary bg-surface-container-lowest font-semibold shadow-sm translate-x-1 duration-200' : 'text-secondary hover:text-primary font-medium'}`}
        >
          <span className="material-symbols-outlined" data-icon="insights">insights</span>
          <span>Insights</span>
        </NavLink>
        {isAdmin && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 font-inter text-sm transition-all rounded-xl ${isActive ? 'text-error bg-surface-container-lowest font-semibold shadow-sm translate-x-1 duration-200' : 'text-secondary hover:text-error font-medium'}`}
          >
            <span className="material-symbols-outlined" data-icon="manage_accounts">manage_accounts</span>
            <span>User Management</span>
          </NavLink>
        )}
      </nav>
      <div className="mt-auto flex flex-col gap-y-2 border-t border-outline-variant/20 pt-4">
        <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container hover:text-on-error-container rounded-xl transition-all font-inter text-sm font-bold w-full text-left">
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
