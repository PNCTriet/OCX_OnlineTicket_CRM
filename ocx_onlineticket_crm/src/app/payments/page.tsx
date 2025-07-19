"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import {
  IconCreditCard,
  IconUser,
  IconCheck,
  IconX,
  IconClock,
  IconCalendarEvent,
  IconBuilding,
  IconFilter,
  IconCalendar,
} from "@tabler/icons-react";
import Image from "next/image";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  order?: {
    user?: {
      email?: string;
      avatar_url?: string;
      first_name?: string;
      last_name?: string;
    };
    organization?: { name?: string };
    event?: { title?: string };
  };
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  organizationId: string;
  status: string;
  paymentMethod: string;
}

const paymentStatusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return "bg-green-500 text-white";
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "FAILED":
      return "bg-red-500 text-white";
    case "PROCESSING":
      return "bg-blue-500 text-white";
    case "REFUNDED":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const paymentMethodColor = (method?: string) => {
  switch ((method || "").toUpperCase()) {
    case "STRIPE":
      return "bg-blue-500 text-white";
    case "MOMO":
      return "bg-pink-500 text-white";
    case "VNPAY":
      return "bg-green-500 text-white";
    case "CASH":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const AvatarImg = ({ src, alt }: { src?: string; alt?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return imgSrc ? (
    <Image
      src={imgSrc}
      alt={alt || "Avatar"}
      width={32}
      height={32}
      className="rounded-full object-cover bg-gray-200"
      onError={() => setImgSrc("/images/user/owner.jpg")}
    />
  ) : (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
      <IconUser className="w-5 h-5 text-gray-400 dark:text-gray-300" />
    </span>
  );
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    organizationId: "",
    status: "",
    paymentMethod: "",
  });

  // Lấy JWT token từ localStorage hoặc auth context
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token")
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/organizations`);
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data);
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }

      try {
        // For now, we'll fetch all orders and their payments
        // In a real implementation, you'd have a dedicated /payments endpoint
        const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!ordersRes.ok) {
          if (ordersRes.status === 401) {
            setError("Authentication failed. Please login again.");
          } else {
            throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
          }
          return;
        }

        const orders = await ordersRes.json();
        
        // Fetch payments for each order
        const allPayments: Payment[] = [];
        for (const order of orders) {
          try {
            const paymentsRes = await fetch(`${API_BASE_URL}/orders/${order.id}/payments`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (paymentsRes.ok) {
              const payments = await paymentsRes.json();
              // Add order information to each payment
              const paymentsWithOrder = payments.map((payment: Payment) => ({
                ...payment,
                order: {
                  user: order.user,
                  organization: order.organization,
                  event: order.event,
                },
              }));
              allPayments.push(...paymentsWithOrder);
            }
          } catch (err) {
            console.error(`Failed to fetch payments for order ${order.id}:`, err);
          }
        }

        // Apply filters
        let filteredPayments = allPayments;

        if (filters.dateFrom) {
          filteredPayments = filteredPayments.filter(
            (payment) => new Date(payment.created_at) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filteredPayments = filteredPayments.filter(
            (payment) => new Date(payment.created_at) <= new Date(filters.dateTo)
          );
        }

        if (filters.status) {
          filteredPayments = filteredPayments.filter(
            (payment) => payment.status.toUpperCase() === filters.status.toUpperCase()
          );
        }

        if (filters.paymentMethod) {
          filteredPayments = filteredPayments.filter(
            (payment) => payment.payment_method.toUpperCase() === filters.paymentMethod.toUpperCase()
          );
        }

        setPayments(filteredPayments);
      } catch (err: any) {
        setError(err.message || "Error fetching payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      organizationId: "",
      status: "",
      paymentMethod: "",
    });
  };

  const getTotalAmount = () => {
    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  };

  return (
    <DashboardLayout>
      <div className="px-[5px] mx-auto w-full md:px-[5px]">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <IconCreditCard className="w-7 h-7 text-blue-500" /> Payments
        </h1>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
              <IconFilter className="w-5 h-5 text-blue-500" /> Filters
            </h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization
                </label>
                <select
                  value={filters.organizationId}
                  onChange={(e) => handleFilterChange("organizationId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Organizations</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Methods</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="MOMO">Momo</option>
                  <option value="VNPAY">VNPay</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Payments</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{payments.length}</p>
              </div>
              <IconCreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {getTotalAmount().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <IconCalendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {payments.length > 0
                    ? `${Math.round(
                        (payments.filter(p => p.status === "SUCCESS").length / payments.length) * 100
                      )}%`
                    : "0%"}
                </p>
              </div>
              <IconCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
              <IconCreditCard className="w-5 h-5 text-blue-500" /> Payment List
            </h3>
          </div>
          <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : payments.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No payments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-fixed w-full min-w-[1200px] divide-y divide-gray-100 dark:divide-gray-800">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        #
                      </th>
                      <th className="w-[300px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        User
                      </th>
                      <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Event
                      </th>
                      <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Organization
                      </th>
                      <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Amount
                      </th>
                      <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Method
                      </th>
                      <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Status
                      </th>
                      <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Transaction ID
                      </th>
                      <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {payments.map((payment, idx) => (
                      <tr key={payment.id}>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <AvatarImg
                              src={payment.order?.user?.avatar_url}
                              alt={payment.order?.user?.email}
                            />
                            <span className="max-w-[150px] whitespace-nowrap text-ellipsis">
                              {payment.order?.user?.email || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <IconCalendarEvent className="w-5 h-5 text-blue-400 shrink-0" />
                            <span className="max-w-[120px] whitespace-nowrap text-ellipsis">
                              {payment.order?.event?.title || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <IconBuilding className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="max-w-[120px] whitespace-nowrap text-ellipsis">
                              {payment.order?.organization?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          {Number(payment.amount).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td className="py-3 px-4 align-middle">
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${paymentMethodColor(payment.payment_method)}`}>
                            <span className="font-semibold">{payment.payment_method}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 align-middle">
                          {payment.status === "SUCCESS" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                              <IconCheck className="w-4 h-4" />
                              <span className="font-semibold">Success</span>
                            </span>
                          )}
                          {payment.status === "PENDING" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white">
                              <IconClock className="w-4 h-4" />
                              <span className="font-semibold">Pending</span>
                            </span>
                          )}
                          {payment.status === "FAILED" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">Failed</span>
                            </span>
                          )}
                          {payment.status === "PROCESSING" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-500 text-white">
                              <IconClock className="w-4 h-4" />
                              <span className="font-semibold">Processing</span>
                            </span>
                          )}
                          {payment.status === "REFUNDED" && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-purple-500 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">Refunded</span>
                            </span>
                          )}
                          {!["SUCCESS", "PENDING", "FAILED", "PROCESSING", "REFUNDED"].includes(payment.status) && (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-500 text-white">
                              <IconX className="w-4 h-4" />
                              <span className="font-semibold">
                                {payment.status}
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {payment.transaction_id}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                          <span className="text-base text-gray-500 dark:text-gray-300">
                            {payment.created_at
                              ? new Date(payment.created_at).toLocaleString()
                              : "-"}
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