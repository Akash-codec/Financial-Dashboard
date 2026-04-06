import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-inter flex">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="ml-64 pt-24 px-8 pb-12 box-border w-full max-w-[calc(100vw-16rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
