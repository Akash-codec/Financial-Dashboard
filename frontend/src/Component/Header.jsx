import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const { user } = useSelector((state) => state.auth);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div className="relative w-96 hidden md:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-outline">
            <span className="material-symbols-outlined text-xl" data-icon="search">search</span>
          </span>
          <input className="w-full bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-sm font-inter focus:ring-2 focus:ring-primary/40 focus:outline-none" placeholder="Search accounts, analytics, reports..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-6">
        
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-secondary"
          title="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[22px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 group cursor-pointer pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">{user ? user.name : 'Unknown User'}</p>
              <p className="text-[10px] text-secondary">{user ? user.email : ''}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-manrope">
              {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
