"use client";
import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { API_BASE_URL } from '@/lib/apiConfig';
import Image from 'next/image';
import { IconUser, IconPlus, IconEdit, IconTrash, IconX, IconCheck } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  [key: string]: any;
}

interface UserFormData {
  supabase_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  role: string;
}

// Helper Avatar component để fallback khi lỗi
const AvatarImg = ({ src, alt }: { src?: string, alt?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return imgSrc ? (
    <Image
      src={imgSrc}
      alt={alt || 'Avatar'}
      width={40}
      height={40}
      className="rounded-full object-cover bg-gray-200"
      onError={() => setImgSrc('/images/user/owner.jpg')}
    />
  ) : (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
      <IconUser className="w-6 h-6 text-gray-400 dark:text-gray-300" />
    </span>
  );
};

export default function UsersPage() {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states for CRUD operations
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  
  function showToast(message: string, type: 'success' | 'error') {
    setToast({ open: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, open: false })), 3000);
  }

  // Copy email function
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy email:', error);
      showToast('Failed to copy email!', 'error');
    }
  };
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<UserFormData>({
    supabase_id: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Failed to create user');
      
      await fetchUsers();
      await refreshUser(); // Refresh user data after creating user
      setShowCreateModal(false);
      resetForm();
      showToast('Tạo user thành công!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Error creating user';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setUpdateLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error('Failed to update user');
      
      await fetchUsers();
      await refreshUser(); // Refresh user data after updating user
      setShowUpdateModal(false);
      resetForm();
      showToast('Cập nhật user thành công!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Error updating user';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete user');
      
      await fetchUsers();
      await refreshUser(); // Refresh user data after deleting user
      setShowDeleteModal(false);
      setSelectedUser(null);
      showToast('Xóa user thành công!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Error deleting user';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supabase_id: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      avatar_url: '',
      role: 'USER'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      supabase_id: user.supabase_id || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      avatar_url: user.avatar_url || '',
      role: user.role || 'USER'
    });
    setShowUpdateModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Badge màu Tailwind mặc định
  const statusColor = (status?: string) => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-500 text-white';
      case 'INACTIVE':
      case 'BLOCKED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Check if current user is superadmin
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  
  // Badge màu cho role
  const roleColor = (role?: string) => {
    switch ((role || '').toUpperCase()) {
      case 'SUPERADMIN':
        return 'bg-purple-500 text-white';
      case 'ADMIN_ORGANIZER':
        return 'bg-blue-500 text-white';
      case 'OWNER_ORGANIZER':
        return 'bg-orange-500 text-white';
      case 'USER':
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Badge màu cho is_verified
  const verifiedColor = (v?: boolean) => v ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

  // Toast Notification Component
  const Toast = ({ open, message, type, onClose }: { open: boolean; message: string; type: 'success' | 'error'; onClose: () => void }) => {
    if (!open) return null;
    return (
      <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
        {message}
        <button onClick={onClose} className="ml-4 text-white/80 hover:text-white font-bold">×</button>
      </div>
    );
  };

  // Chỉ định thứ tự và nhãn cột đẹp
  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'avatar_url', label: 'Avatar' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'is_verified', label: 'Verified' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Users</h1>
          {isSuperAdmin ? (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <IconPlus className="w-4 h-4" />
              Add User
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Only Super Admin can manage users
            </div>
          )}
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">User List</h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                      {columns.map(col => (
                        <th key={col.key} className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">{col.label}</th>
                      ))}
                      <th className="py-3 px-4 text-right font-semibold text-gray-700 text-sm dark:text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user, idx) => (
                      <tr key={user.id || idx}>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {idx + 1}
                        </td>
                        {columns.map(col => (
                          <td key={col.key} className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {col.key === 'avatar_url' ? (
                              <div className="flex items-center justify-center">
                                <AvatarImg src={user.avatar_url} alt={user.email} />
                              </div>
                            ) : col.key === 'email' ? (
                              <button
                                onClick={() => copyEmail(user.email)}
                                className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group relative"
                                title={`Click to copy: ${user.email}`}
                              >
                                <span className="block truncate group-hover:underline max-w-[200px]">
                                  {user.email}
                                </span>
                                <div className="absolute left-0 top-full z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  {user.email}
                                </div>
                              </button>
                            ) : col.key === 'role' ? (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor(user.role)}`}>{user.role || 'USER'}</span>
                            ) : col.key === 'is_verified' ? (
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${verifiedColor(user.is_verified)}`}>{user.is_verified ? 'Verified' : 'Unverified'}</span>
                            ) : col.key === 'created_at' || col.key === 'updated_at' ? (
                              <span className="text-xs">{user[col.key] ? new Date(user[col.key]).toLocaleString() : '-'}</span>
                            ) : (
                              String(user[col.key] ?? '-')
                            )}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-right">
                          {isSuperAdmin ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openUpdateModal(user)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              >
                                <IconEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(user)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-300 bg-white text-red-700 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <IconTrash className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              Read Only
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && isSuperAdmin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Create User</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Supabase ID
                  </label>
                  <input
                    type="text"
                    value={formData.supabase_id}
                    onChange={(e) => setFormData({...formData, supabase_id: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter Supabase ID"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter avatar URL"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN-ORGANIZER">Admin Organizer</option>
                    <option value="OWNER-ORGANIZER">Owner Organizer</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {createLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    )}
                    {createLoading ? 'Đang tạo...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={createLoading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && selectedUser && isSuperAdmin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Update User</h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    placeholder="Enter avatar URL"
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN_ORGANIZER">Admin Organizer</option>
                    <option value="OWNER_ORGANIZER">Owner Organizer</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {updateLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    )}
                    {updateLoading ? 'Đang cập nhật...' : 'Update User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    disabled={updateLoading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedUser && isSuperAdmin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Delete User</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete user <strong>{selectedUser.email}</strong>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleteLoading && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {deleteLoading ? 'Đang xóa...' : 'Delete User'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Toast Notification */}
        <Toast 
          open={toast.open} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(t => ({ ...t, open: false }))} 
        />
      </div>
    </DashboardLayout>
  );
} 