import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUserRole, resetUsersState } from '../features/users/userSlice';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { usersList, isLoading } = useSelector((state) => state.users);

  useEffect(() => {
    // If not admin, redirect
    if (user && user.role !== 'Admin' && user.role !== 'admin') {
      navigate('/dashboard');
    } else {
      dispatch(fetchUsers());
    }
    
    return () => { dispatch(resetUsersState()); };
  }, [user, navigate, dispatch]);

  const handleRoleChange = (id, newRole) => {
    dispatch(updateUserRole({ id, role: newRole }));
  };

  if (isLoading) {
    return <div className="p-10 text-center font-bold text-secondary">Loading Admin Panel...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-secondary mb-2 font-medium">
            <span>Workspace</span>
            <span className="material-symbols-outlined text-[14px]" data-icon="chevron_right">chevron_right</span>
            <span className="text-error">Admin Panel</span>
          </nav>
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-extrabold font-manrope text-on-surface tracking-tight">User Management</h1>
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-secondary">Total: {usersList.length} Users</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(25,27,35,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">User Name</th>
                <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Email</th>
                <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Role</th>
                <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-on-surface">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-secondary font-medium">{u.email}</span>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === user._id}
                      className="px-3 py-2 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none text-sm font-bold capitalize disabled:opacity-50"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="analyst">Analyst</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-[0.75rem] text-[11px] font-bold uppercase ${u.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-secondary">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
              {usersList.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-secondary font-medium">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
