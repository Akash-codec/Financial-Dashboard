import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      toast.success('Login successful!');
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-10 rounded-2xl shadow-[0px_12px_32px_rgba(25,27,35,0.06)] border border-outline-variant/10">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary mx-auto shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-3xl" data-icon="architecture">architecture</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface font-manrope">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary font-medium">
            Welcome back to The Fiscal Architect
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-surface-container-low border border-transparent placeholder-outline text-on-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                placeholder="developer@example.com"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-surface-container-low border border-transparent placeholder-outline text-on-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                placeholder="********"
                value={password}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center">
            <p className="text-sm text-secondary font-medium mt-4">
              Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-primary-container hover:underline">Register here</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
