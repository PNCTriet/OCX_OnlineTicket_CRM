"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, Title, AreaChart, BarChart, LineChart, Metric, Text } from "@tremor/react";

interface TimeSeriesData {
  time: string;
  revenue: number;
  tickets_sold: number;
  events_created?: number;
  organizations_created?: number;
}

interface TimeSeriesChartProps {
  title: string;
  groupBy: 'day' | 'week' | 'month';
  fromDate?: string;
  toDate?: string;
  organizationId?: string;
  loading?: boolean;
  chartType?: 'area' | 'bar' | 'line';
}

export default function TimeSeriesChart({ 
  title, 
  groupBy, 
  fromDate, 
  toDate, 
  organizationId,
  loading = false,
  chartType = 'bar'
}: TimeSeriesChartProps) {
  const { token } = useAuth();
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimeSeriesData();
  }, [token, groupBy, fromDate, toDate, organizationId]);

  const fetchTimeSeriesData = async () => {
    if (!token) return;

    try {
      setChartLoading(true);
      
      // Build URL with query parameters
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      params.append('groupBy', groupBy);
      
      let url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system/time`;
      if (organizationId) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/organization/${organizationId}/time`;
      }
      
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch time series data");
      }

      const responseData = await response.json();
      setData(responseData);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (groupBy) {
      case 'day':
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
      case 'week':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'month':
        return date.toLocaleDateString('vi-VN', { month: 'short' });
      default:
        return date.toLocaleDateString('vi-VN');
    }
  };

  // Transform data for Tremor charts
  const chartData = data.map(item => ({
    date: formatDate(item.time),
    Revenue: item.revenue,
    "Tickets Sold": item.tickets_sold,
    "Events Created": item.events_created || 0,
    "Organizations Created": item.organizations_created || 0,
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalTickets = data.reduce((sum, item) => sum + item.tickets_sold, 0);

  if (loading || chartLoading) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{title}</Title>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{title}</Title>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Text className="text-red-500 mb-2">Error loading data</Text>
            <button
              onClick={fetchTimeSeriesData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="dark:bg-white/[0.03] dark:border-gray-800">
        <Title className="dark:text-white/90">{title}</Title>
        <div className="h-64 flex items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">No data available</Text>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      index: "date",
      categories: ["Revenue", "Tickets Sold"],
      colors: ["blue", "cyan"],
      valueFormatter: (value: number) => formatCurrency(value),
      className: "h-48",
    };

    switch (chartType) {
      case 'area':
        return <AreaChart {...commonProps} />;
      case 'line':
        return <LineChart {...commonProps} />;
      case 'bar':
      default:
        return <BarChart {...commonProps} />;
    }
  };

  return (
    <Card className="dark:bg-white/[0.03] dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Title className="dark:text-white/90">{title}</Title>
        <button 
          onClick={fetchTimeSeriesData}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {renderChart()}
      
      {/* Summary Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="dark:bg-white/[0.02] dark:border-gray-700">
          <Metric className="dark:text-white">
            {formatCurrency(totalRevenue)}
          </Metric>
          <Text className="dark:text-gray-400">Total Revenue</Text>
        </Card>
        <Card className="dark:bg-white/[0.02] dark:border-gray-700">
          <Metric className="dark:text-white">
            {formatNumber(totalTickets)}
          </Metric>
          <Text className="dark:text-gray-400">Total Tickets</Text>
        </Card>
      </div>
    </Card>
  );
} 