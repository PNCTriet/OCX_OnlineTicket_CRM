"use client";
import React, { useState } from 'react';
import { login } from '@/lib/authApi';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserInfo(null);
    try {
      const data = await login(email, password);
      setUserInfo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          onClick={onClose}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <input
              type="password"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        {userInfo && (
          <div className="mt-4 p-3 rounded bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200">
            <div className="font-semibold mb-1">Đăng nhập thành công!</div>
            <div><b>Email:</b> {userInfo.user?.email || userInfo.email}</div>
            {userInfo.user?.role && <div><b>Role:</b> {userInfo.user.role}</div>}
            {userInfo.user?.roles && <div><b>Roles:</b> {Array.isArray(userInfo.user.roles) ? userInfo.user.roles.join(', ') : userInfo.user.roles}</div>}
            <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto"><code>{JSON.stringify(userInfo, null, 2)}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 