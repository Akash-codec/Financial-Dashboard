import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './Component/Layout';
import Dashboard from './Pages/Dashboard';
import Transactions from './Pages/Transactions';
import Insights from './Pages/Insights';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminPanel from './Pages/AdminPanel';
import AdminRoute from './Component/AdminRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'font-inter text-sm font-bold shadow-xl rounded-xl', duration: 4000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="insights" element={<Insights />} />
          <Route path="users" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
