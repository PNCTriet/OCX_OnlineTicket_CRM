"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { API_BASE_URL } from '@/lib/apiConfig';
import Image from 'next/image';
import { IconUser } from '@tabler/icons-react';

interface User {
  [key: string]: any;
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
  // Badge màu cho role
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
  // Badge màu cho is_verified
  const verifiedColor = (v?: boolean) => v ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

  // Chỉ định thứ tự và nhãn cột đẹp
  const columns = [
    // { key: 'id', label: 'ID' },
    // { key: 'supabase_id', label: 'Supabase ID' },
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
                        <th key={col.key} className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map((user, idx) => (
                      <tr key={user.id || idx}>
                        {columns.map(col => (
                          <td key={col.key} className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {col.key === 'avatar_url' ? (
                              <div className="flex items-center justify-center">
                                <AvatarImg src={user.avatar_url} alt={user.email} />
                              </div>
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