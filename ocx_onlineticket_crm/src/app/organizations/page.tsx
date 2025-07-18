"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { API_BASE_URL } from '@/lib/apiConfig';
import OrganizationDetailModal from './OrganizationDetailModal';

interface Organization {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/organizations`);
        if (!res.ok) throw new Error('Failed to fetch organizations');
        const data = await res.json();
        setOrgs(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching organizations');
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  return (
    <DashboardLayout>
      <div className={selectedOrgId ? "relative filter blur-sm pointer-events-none select-none" : ""}>
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">Organizations</h1>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Organization List</h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : orgs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No organizations found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Phone</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Address</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Website</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orgs.map(org => (
                      <tr key={org.id}>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90">{org.name}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{org.contact_email || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{org.phone || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{org.address || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {org.website ? (
                            <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{org.website}</a>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 align-middle">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
                            onClick={() => setSelectedOrgId(org.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      {selectedOrgId && (
        <OrganizationDetailModal
          organizationId={selectedOrgId}
          onClose={() => setSelectedOrgId(null)}
        />
      )}
    </DashboardLayout>
  );
} 