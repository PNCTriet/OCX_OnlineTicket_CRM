"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconCoin, IconCalendar } from "@/components/icons/TablerIcons";
import DailySalesChart from "@/components/charts/DailySalesChart";
import WeeklySalesChart from "@/components/charts/WeeklySalesChart";
import TicketMetricsChart from "@/components/charts/TicketMetricsChart";
import {
  IconCoins,
  IconMenuOrder,
  IconLayoutDashboard,
  IconBuilding,
  IconUsers,
  IconCalendarEvent,
  IconTicket,
  IconShoppingCart,
  IconCheck,
  IconCreditCard,
  IconPlaneInflight,
  IconMail,
} from "@tabler/icons-react";

interface DashboardStats {
  total_revenue: number;
  total_tickets_sold: number;
  total_orders: number;
  total_events: number;
  total_organizations: number;
}

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface MonthlySalesData {
  time: string;
  revenue: number;
  tickets_sold: number;
  events_created: number;
  organizations_created: number;
}

interface DailySalesData {
  time: string;
  revenue: number;
  tickets_sold: number;
  events_created: number;
  organizations_created: number;
}

interface WeeklySalesData {
  time: string;
  revenue: number;
  tickets_sold: number;
  events_created: number;
  organizations_created: number;
}

export default function DashboardPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySalesData[]>([]);
  const [dailySales, setDailySales] = useState<DailySalesData[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, token]);

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Fetch dashboard stats
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch users data
      const usersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Fetch monthly sales data
      const currentDate = new Date();
      const fromDate = new Date(currentDate.getFullYear(), 0, 1); // Start of current year
      const toDate = new Date(currentDate.getFullYear(), 11, 31); // End of current year

      const monthlyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system/time?from=${
          fromDate.toISOString().split("T")[0]
        }&to=${toDate.toISOString().split("T")[0]}&groupBy=month`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (monthlyResponse.ok) {
        const monthlyData = await monthlyResponse.json();
        const completeYearData = generateCompleteYearData(
          monthlyData,
          currentDate.getFullYear()
        );
        setMonthlySales(completeYearData);
      }

      // Fetch daily sales data (last 7 days)
      const dailyFromDate = new Date();
      dailyFromDate.setDate(dailyFromDate.getDate() - 6);
      const dailyToDate = new Date();

      const dailyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system/time?from=${
          dailyFromDate.toISOString().split("T")[0]
        }&to=${dailyToDate.toISOString().split("T")[0]}&groupBy=day`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        const completeWeekData = generateCompleteWeekData(dailyData);
        setDailySales(completeWeekData);
      }

      // Fetch weekly sales data (last 4 weeks)
      const weeklyFromDate = new Date();
      weeklyFromDate.setDate(weeklyFromDate.getDate() - 27);
      const weeklyToDate = new Date();

      const weeklyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/system/time?from=${
          weeklyFromDate.toISOString().split("T")[0]
        }&to=${weeklyToDate.toISOString().split("T")[0]}&groupBy=week`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json();
        const completeMonthData = generateCompleteMonthData(weeklyData);
        setWeeklySales(completeMonthData);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteYearData = (
    apiData: MonthlySalesData[],
    year: number
  ): MonthlySalesData[] => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const completeData: MonthlySalesData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const existingData = apiData.find((item) => item.time === monthStr);

      completeData.push({
        time: monthStr,
        revenue: existingData?.revenue || 0,
        tickets_sold: existingData?.tickets_sold || 0,
        events_created: existingData?.events_created || 0,
        organizations_created: existingData?.organizations_created || 0,
      });
    }

    return completeData;
  };

  const generateCompleteWeekData = (
    apiData: DailySalesData[]
  ): DailySalesData[] => {
    const completeData: DailySalesData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const existingData = apiData.find((item) => item.time === dateStr);

      completeData.push({
        time: dateStr,
        revenue: existingData?.revenue || 0,
        tickets_sold: existingData?.tickets_sold || 0,
        events_created: existingData?.events_created || 0,
        organizations_created: existingData?.organizations_created || 0,
      });
    }

    return completeData;
  };

  const generateCompleteMonthData = (
    apiData: WeeklySalesData[]
  ): WeeklySalesData[] => {
    const completeData: WeeklySalesData[] = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);
      const dateStr = date.toISOString().split("T")[0];
      const existingData = apiData.find((item) => item.time === dateStr);

      completeData.push({
        time: dateStr,
        revenue: existingData?.revenue || 0,
        tickets_sold: existingData?.tickets_sold || 0,
        events_created: existingData?.events_created || 0,
        organizations_created: existingData?.organizations_created || 0,
      });
    }

    return completeData;
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

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[date.getMonth()];
  };

  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[date.getDay()];
  };

  const formatWeek = (dateString: string) => {
    const date = new Date(dateString);
    return `Week ${Math.ceil((date.getDate() + date.getDay()) / 7)}`;
  };

  const getMaxRevenue = (data: any[]) => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.revenue));
  };

  const getYAxisLabels = (data: any[]) => {
    const maxRevenue = getMaxRevenue(data);
    if (maxRevenue === 0) return ["0", "0", "0", "0", "0"];

    const step = maxRevenue / 4;
    return [
      "0",
      formatCompactCurrency(Math.round(step)),
      formatCompactCurrency(Math.round(step * 2)),
      formatCompactCurrency(Math.round(step * 3)),
      formatCompactCurrency(Math.round(maxRevenue)),
    ];
  };

  const getYAxisPositions = () => {
    return [0, 25, 50, 75, 100];
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  if (!isAuthenticated) return null;

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Error loading dashboard
              </div>
              <div className="text-gray-600 dark:text-gray-400">{error}</div>
              <button
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Metric Group One */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6">
              {/* Metric 1 - Total Revenue */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-500/15">
                  <IconCoins className="text-green-600 dark:text-green-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Revenue
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {stats ? formatCurrency(stats.total_revenue) : "0 ₫"}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
                </div>
              </div>

              {/* Metric 2 - Total Users */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/15">
                  <IconUsers className="text-teal-600 dark:text-teal-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total Users
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {formatNumber(users.length)}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-teal-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-teal-600 dark:bg-teal-500/15 dark:text-teal-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
                </div>
              </div>

              {/* Metric 3 - Total Orders */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15">
                  <IconShoppingCart className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Orders
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {stats ? formatNumber(stats.total_orders) : "0"}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
                </div>
              </div>

              {/* Metric 4 - Total Tickets Sold */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/15">
                  <IconTicket className="text-purple-600 dark:text-purple-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tickets Sold
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {stats ? formatNumber(stats.total_tickets_sold) : "0"}
                    </h4>
                </div>
                  <span className="flex items-center gap-1 rounded-full bg-purple-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-purple-600 dark:bg-purple-500/15 dark:text-purple-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
            </div>
          </div>

              {/* Metric 5 - Total Events */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/15">
                  <IconCalendarEvent className="text-orange-600 dark:text-orange-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total Events
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {stats ? formatNumber(stats.total_events) : "0"}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-orange-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
                </div>
              </div>

              {/* Metric 6 - Total Organizations */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15">
                  <IconBuilding className="text-indigo-600 dark:text-indigo-500" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Organizations
                    </span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                      {stats ? formatNumber(stats.total_organizations) : "0"}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-indigo-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-500">
                    <svg
                      className="fill-current"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                      />
                    </svg>
                    Live
                  </span>
                </div>
              </div>
              
            </div>
          </div>
          {/* Ticket Metrics Chart */}
          <div className="col-span-12">
            <TicketMetricsChart loading={loading} />
                </div>
          {/* Chart One - Monthly Sales */}
          <div className="col-span-12">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
              <div className="relative overflow-hidden rounded-b-2xl flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Monthly Sales
                </h3>
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                    />
                  </svg>
                </button>
              </div>
              <div className="max-w-full mt-4">
                <div className="w-full">
                  <div className="h-[180px] w-full relative">
                    {monthlySales.length > 0 ? (
                      <>
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full w-8 text-xs text-gray-500 dark:text-gray-400">
                          {getYAxisLabels(monthlySales)
                            .reverse()
                            .map((label, index) => {
                              const position = getYAxisPositions()[index];
                              return (
                                <div
                                  key={index}
                                  className="absolute text-right text-xs transform -translate-y-1/2 pr-1"
                                  style={{ top: `${position}%` }}
                                >
                                  {label}
              </div>
                              );
                            })}
                    </div>

                        {/* Chart bars */}
                        <div className="ml-10 h-full flex items-end justify-between px-2 pb-4 relative z-10">
                          {monthlySales.map((data, index) => {
                            const maxRevenue = getMaxRevenue(monthlySales);
                            const height =
                              maxRevenue > 0
                                ? (data.revenue / maxRevenue) * 100
                                : 0;

                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center h-full"
                              >
                                <div className="flex-1 flex items-end justify-center">
                                  <div
                                    className="w-4 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 relative group"
                                    style={{
                                      height: `${height}%`,
                                      minHeight: "4px",
                                      alignSelf: "flex-end",
                                    }}
                                  >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                    </div>
                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center">
                                  {formatMonth(data.time)}
                  </div>
                </div>
                            );
                          })}
                    </div>

                        {/* Grid lines */}
                        <div className="absolute left-10 top-0 h-full w-full pointer-events-none">
                          {getYAxisPositions().map((position, index) => (
                            <div
                              key={index}
                              className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                              style={{ top: `${position}%` }}
                            ></div>
                          ))}
                    </div>
                      </>
                    ) : (
                      <div className="h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                        No data available
                  </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily and Weekly Charts */}
          {/* <div className="col-span-12 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailySalesChart data={dailySales} loading={loading} />
              <WeeklySalesChart data={weeklySales} loading={loading} />
            </div>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  );
} 
