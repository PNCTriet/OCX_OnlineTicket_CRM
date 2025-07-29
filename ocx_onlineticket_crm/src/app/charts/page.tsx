"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SystemOverviewChart from "@/components/charts/SystemOverviewChart";
import TimeSeriesChart from "@/components/charts/TimeSeriesChart";
import OrganizationStatsChart from "@/components/charts/OrganizationStatsChart";
import EventStatsChart from "@/components/charts/EventStatsChart";

export default function ChartsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Chart Library
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Visualize your data with interactive charts and analytics
          </p>
        </div>

        {/* Chart Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Analytics */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Sales Analytics
              </h3>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Revenue trends, daily sales, monthly comparisons
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Revenue Charts</span>
                <span className="text-green-600 dark:text-green-500">3 charts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Sales Trends</span>
                <span className="text-blue-600 dark:text-blue-500">2 charts</span>
              </div>
            </div>
          </div>

          {/* Event Analytics */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Event Analytics
              </h3>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-500/15 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Event performance, ticket sales, attendance metrics
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Event Performance</span>
                <span className="text-green-600 dark:text-green-500">2 charts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Ticket Analytics</span>
                <span className="text-blue-600 dark:text-blue-500">3 charts</span>
              </div>
            </div>
          </div>

          {/* Organization Analytics */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Organization Analytics
              </h3>
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/15 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Organization growth, user engagement, activity metrics
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Growth Metrics</span>
                <span className="text-green-600 dark:text-green-500">2 charts</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">User Activity</span>
                <span className="text-blue-600 dark:text-blue-500">1 chart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Grid */}
        <div className="space-y-6">
          {/* System Analytics Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              System Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemOverviewChart />
              <TimeSeriesChart 
                title="Revenue Trends (Daily)"
                groupBy="day"
                fromDate="2025-01-01"
                toDate="2025-12-31"
                chartType="bar"
              />
            </div>
          </div>

          {/* Organization Analytics Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Organization Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrganizationStatsChart 
                organizationId="cmd5g7d2w0003v78sdjha8onv"
                organizationName="Howls Studio"
              />
              <TimeSeriesChart 
                title="Organization Revenue (Weekly)"
                groupBy="week"
                organizationId="cmd5g7d2w0003v78sdjha8onv"
                fromDate="2025-01-01"
                toDate="2025-12-31"
                chartType="area"
              />
            </div>
          </div>

          {/* Event Analytics Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Event Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventStatsChart 
                eventId="cmd5gmqgp0005v78s79bina9z"
                eventName="Sự kiện âm nhạc Howls"
              />
              <TimeSeriesChart 
                title="Event Revenue (Monthly)"
                groupBy="month"
                fromDate="2025-01-01"
                toDate="2025-12-31"
                chartType="line"
              />
            </div>
          </div>

          {/* Additional Charts Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Additional Analytics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeSeriesChart 
                title="System Growth (Monthly)"
                groupBy="month"
                fromDate="2025-01-01"
                toDate="2025-12-31"
                chartType="area"
              />
              <TimeSeriesChart 
                title="Ticket Sales (Daily)"
                groupBy="day"
                fromDate="2025-01-01"
                toDate="2025-12-31"
                chartType="bar"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 