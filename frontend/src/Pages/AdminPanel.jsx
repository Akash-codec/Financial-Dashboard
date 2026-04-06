import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUser, resetUsersState } from '../features/users/userSlice';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { usersList, isLoading } = useSelector((state) => state.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('viewer');
  const [editStatus, setEditStatus] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers());
    return () => { dispatch(resetUsersState()); };
  }, [dispatch]);

  const isSelf = (targetUserId) => user?._id === targetUserId;

  const openEditCard = (targetUser) => {
    setSelectedUser(targetUser);
    setEditRole(targetUser.role);
    setEditStatus(Boolean(targetUser.isActive));
  };

  const closeEditCard = () => {
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(updateUser({
        id: selectedUser._id,
        role: editRole,
        isActive: editStatus,
      })).unwrap();
      toast.success('User updated successfully');
      closeEditCard();
    } catch (error) {
      toast.error(error || 'Failed to update user');
    }
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
                <tr
                  key={u._id}
                  className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                  onClick={() => openEditCard(u)}
                >
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
                    <span className="px-3 py-2 bg-surface-container-low rounded-xl text-sm font-bold capitalize inline-block">
                      {u.role}
                    </span>
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

      {selectedUser && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.25)] border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20">
              <h2 className="text-xl font-extrabold font-manrope text-on-surface">Update User</h2>
              <p className="text-sm text-secondary mt-1">{selectedUser.name} - {selectedUser.email}</p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-bold capitalize"
                >
                  <option value="viewer">Viewer</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Status</label>
                <select
                  value={String(editStatus)}
                  onChange={(e) => setEditStatus(e.target.value === 'true')}
                  className="w-full px-3 py-3 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-bold"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeEditCard}
                className="px-4 py-2 rounded-xl text-sm font-bold text-secondary bg-surface-container-low hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSelf(selectedUser._id)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-container disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
