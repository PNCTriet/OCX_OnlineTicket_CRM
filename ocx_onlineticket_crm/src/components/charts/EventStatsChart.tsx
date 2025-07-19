"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, Title, BarChart, DonutChart, Metric, Text, ProgressBar } from "@tremor/react";

interface EventStats {
  event_id: string;
  total_revenue: number;
  total_tickets_sold: number;
  total_orders: number;
}

interface EventStatsChartProps {
  eventId: string;
  eventName?: string;
  loading?: boolean;
}

export default function EventStatsChart({ 
  eventId, 
  eventName = "Event",
  loading = false 
}: EventStatsChartProps) {
  const { token } = useAuth();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEventStats();
    }
  }, [token, eventId]);

  const fetchEventStats = async () => {
    if (!token || !eventId) return;

    try {
      setChartLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch event stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setChartLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  if (loading || chartLoading) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{eventName} Stats</Title>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{eventName} Stats</Title>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Text className="text-red-500 mb-2">Error loading data</Text>
            <button
              onClick={fetchEventStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{eventName} Stats</Title>
        <div className="h-64 flex items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        </div>
      </Card>
    );
  }

  // Prepare data for Tremor charts
  const barChartData = [
    {
      metric: "Revenue",
      value: stats.total_revenue,
      formatted: formatCurrency(stats.total_revenue),
    },
    {
      metric: "Tickets Sold",
      value: stats.total_tickets_sold,
      formatted: formatNumber(stats.total_tickets_sold),
    },
    {
      metric: "Orders",
      value: stats.total_orders,
      formatted: formatNumber(stats.total_orders),
    },
  ];

  const donutChartData = [
    {
      name: "Revenue",
      value: stats.total_revenue,
    },
    {
      name: "Tickets",
      value: stats.total_tickets_sold,
    },
    {
      name: "Orders",
      value: stats.total_orders,
    },
  ];

  const progressData = [
    {
      name: "Revenue",
      value: stats.total_revenue,
      target: 5000000, // 5M target
      percentage: Math.min((stats.total_revenue / 5000000) * 100, 100),
    },
    {
      name: "Tickets Sold",
      value: stats.total_tickets_sold,
      target: 500,
      percentage: Math.min((stats.total_tickets_sold / 500) * 100, 100),
    },
    {
      name: "Orders",
      value: stats.total_orders,
      target: 200,
      percentage: Math.min((stats.total_orders / 200) * 100, 100),
    },
  ];

  return (
    <Card className="dark:bg-white/[0.03] dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Title className="dark:text-white/90">{eventName} Stats</Title>
        <button 
          onClick={fetchEventStats}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div>
          <Text className="mb-4 dark:text-gray-400">Metrics Overview</Text>
          <BarChart
            data={barChartData}
            index="metric"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value) => formatCurrency(value)}
            className="h-48"
          />
        </div>
        
        {/* Donut Chart */}
        <div>
          <Text className="mb-4 dark:text-gray-400">Distribution</Text>
          <DonutChart
            data={donutChartData}
            category="value"
            index="name"
            valueFormatter={(value) => formatNumber(value)}
            colors={["blue", "cyan", "indigo"]}
            className="h-48"
          />
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        <Text className="dark:text-gray-400">Progress vs Targets</Text>
        {progressData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <Text className="dark:text-gray-400">{item.name}</Text>
              <Text className="dark:text-gray-400">{Math.round(item.percentage)}%</Text>
            </div>
            <ProgressBar 
              value={item.percentage} 
              color="blue" 
              className="h-2"
            />
          </div>
        ))}
      </div>
      
      {/* Summary Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="dark:bg-white/[0.02] dark:border-gray-700">
          <Metric className="dark:text-white">
            {formatCurrency(stats.total_revenue)}
          </Metric>
          <Text className="dark:text-gray-400">Total Revenue</Text>
        </Card>
        <Card className="dark:bg-white/[0.02] dark:border-gray-700">
          <Metric className="dark:text-white">
            {formatNumber(stats.total_tickets_sold)}
          </Metric>
          <Text className="dark:text-gray-400">Total Tickets</Text>
        </Card>
      </div>
    </Card>
  );
} 