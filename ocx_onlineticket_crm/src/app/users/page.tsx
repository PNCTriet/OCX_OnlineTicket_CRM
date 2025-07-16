"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { API_BASE_URL } from '@/lib/apiConfig';

interface User {
  [key: string]: any;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    fetchUsers();
  }, []);

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
  const roleColor = (role?: string) => {
    switch ((role || '').toUpperCase()) {
      case 'SUPERADMIN':
        return 'bg-purple-500 text-white';
      case 'ADMIN-ORGANIZER':
        return 'bg-blue-500 text-white';
      case 'OWNER-ORGANIZER':
        return 'bg-orange-500 text-white';
      case 'USER':
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Lấy tất cả key của user để render bảng động
  const columns = users.length > 0 ? Object.keys(users[0]) : [];

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">Users</h1>
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
                      {columns.map(col => (
                        <th key={col} className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user, idx) => (
                      <tr key={user.id || idx}>
                        {columns.map(col => (
                          <td key={col} className="py-3 px-4 text-gray-800 dark:text-white/90">
                            {col.toLowerCase() === 'role' ? (
                              <span className={`rounded-full px-2 py-0.5 text-theme-xs font-medium ${roleColor(user[col])}`}>
                                {user[col] || 'USER'}
                              </span>
                            ) : col.toLowerCase() === 'status' ? (
                              <span className={`rounded-full px-2 py-0.5 text-theme-xs font-medium ${statusColor(user[col])}`}>
                                {user[col] || 'ACTIVE'}
                              </span>
                            ) : typeof user[col] === 'object' && user[col] !== null ? (
                              <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(user[col], null, 2)}</pre>
                            ) : (
                              String(user[col] ?? '-')
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 