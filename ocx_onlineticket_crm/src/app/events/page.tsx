"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { API_BASE_URL } from '@/lib/apiConfig';

interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const statusColor = (status?: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
      case 'DRAFT':
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">Events</h1>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Event List</h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No events found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Title</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Location</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Start Date</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">End Date</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {events.map(event => (
                      <tr key={event.id}>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90">{event.title}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{event.location || '-'}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{event.start_date ? new Date(event.start_date).toLocaleString() : '-'}</td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{event.end_date ? new Date(event.end_date).toLocaleString() : '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`rounded-full px-2 py-0.5 text-theme-xs font-medium ${statusColor(event.status)}`}>
                            {event.status || 'DRAFT'}
                          </span>
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
    </DashboardLayout>
  );
} 