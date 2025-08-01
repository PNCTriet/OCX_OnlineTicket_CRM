"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import {
  IconShoppingCart,
  IconUser,
  IconCheck,
  IconX,
  IconClock,
  IconCalendarEvent,
} from "@tabler/icons-react";
import Image from "next/image";
import OrderDetailModal from "./OrderDetailModal";
import PaymentDetailModal from "./PaymentDetailModal";

interface Order {
  id: string;
  user?: {
    email?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  organization?: { name?: string };
  event?: { title?: string };
  total_amount: number;
  status: string;
  payment_status?: string;
  payment_method?: string;
  reserved_until?: string;
  created_at: string;
  updated_at: string;
  sending_status?: string;
}

const statusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "RESERVED":
      return "bg-blue-500 text-white";
    case "PAID":
      return "bg-green-500 text-white";
    case "CANCELLED":
      return "bg-red-500 text-white";
    case "EXPIRED":
      return "bg-gray-400 text-white";
    default:
      return "bg-gray-500 text-white";
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ open: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, open: false })), 3000);
  }

  // Copy email function
  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy email:', error);
      showToast('Failed to copy email!', 'error');
    }
  };

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
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Authentication failed. Please login again.");
          } else {
            throw new Error(`Failed to fetch orders: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <DashboardLayout>
      <div className={(selectedOrderId || selectedPaymentOrderId) ? "relative filter blur-sm pointer-events-none select-none" : ""}>
        <div className="px-[5px] mx-auto w-full md:px-[5px]">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <IconShoppingCart className="w-7 h-7 text-blue-500" /> Orders
          </h1>
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                <IconShoppingCart className="w-5 h-5 text-blue-500" /> Order List
              </h3>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : orders.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  You do not have permission to access this order.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table-fixed w-full min-w-[1300px] divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr className="border-gray-100 border-y dark:border-gray-800">
                        <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          #
                        </th>
                        <th className="w-[250px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          User
                        </th>
                        <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Event
                        </th>
                        <th className="w-[180px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Organization
                        </th>
                        <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Total
                        </th>
                        <th className="w-[140px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Status
                        </th>
                        <th className="w-[140px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Payment
                        </th>
                        <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Reserved Until
                        </th>
                        <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Created At
                        </th>
                        <th className="w-[140px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Sending Status</th>
                        <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {orders.map((order, idx) => (
                        <tr key={order.id}>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[280px]">
                            <div className="flex items-center gap-2">
                              <AvatarImg
                                src={order.user?.avatar_url}
                                alt={order.user?.email}
                              />
                              <button
                                onClick={() => copyEmail(order.user?.email || "")}
                                className="max-w-[250px] text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group relative"
                                title={`Click to copy: ${order.user?.email || "N/A"}`}
                              >
                                <span className="block truncate group-hover:underline">
                                  {order.user?.email || "N/A"}
                                </span>
                                <div className="absolute left-0 top-full z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  {order.user?.email || "N/A"}
                                </div>
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[240px]">
                            <div className="flex items-center gap-2">
                              <IconCalendarEvent className="w-5 h-5 text-blue-400 shrink-0" />
                              <span className="max-w-[150px] whitespace-nowrap text-ellipsis">
                                {order.event?.title || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[180px]">
                            <span className="truncate max-w-[160px] overflow-hidden whitespace-nowrap text-ellipsis">
                              {order.organization?.name || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {Number(order.total_amount).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {order.status === "PAID" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                                <IconCheck className="w-4 h-4" />
                                <span className="font-semibold">Paid</span>
                              </span>
                            )}
                            {order.status === "PENDING" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white">
                                <IconClock className="w-4 h-4" />
                                <span className="font-semibold">Pending</span>
                              </span>
                            )}
                            {order.status === "RESERVED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-500 text-white">
                                <IconClock className="w-4 h-4" />
                                <span className="font-semibold">Reserved</span>
                              </span>
                            )}
                            {order.status === "CANCELLED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">Cancelled</span>
                              </span>
                            )}
                            {order.status === "EXPIRED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-400 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">Expired</span>
                              </span>
                            )}
                            {![
                              "PAID",
                              "PENDING",
                              "RESERVED",
                              "CANCELLED",
                              "EXPIRED",
                            ].includes(order.status) && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-500 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">
                                  {order.status}
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {order.payment_status === "COMPLETED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                                <IconCheck className="w-4 h-4" />
                                <span className="font-semibold">Paid</span>
                              </span>
                            )}
                            {order.payment_status === "PENDING" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white">
                                <IconClock className="w-4 h-4" />
                                <span className="font-semibold">Pending</span>
                              </span>
                            )}
                            {order.payment_status === "FAILED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">Failed</span>
                              </span>
                            )}
                            {order.payment_status === "PROCESSING" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-500 text-white">
                                <IconClock className="w-4 h-4" />
                                <span className="font-semibold">Processing</span>
                              </span>
                            )}
                            {order.payment_status === "REFUNDED" && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-purple-500 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">Refunded</span>
                              </span>
                            )}
                            {!order.payment_status && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-400 text-white">
                                <IconX className="w-4 h-4" />
                                <span className="font-semibold">N/A</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            <span className="text-base text-blue-500 dark:text-blue-300">
                              {order.reserved_until
                                ? new Date(order.reserved_until).toLocaleString()
                                : "-"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            <span className="text-base text-gray-500 dark:text-gray-300">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleString()
                                : "-"}
                            </span>
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {order.sending_status === 'SENT' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">SENT</span>
                            )}
                            {order.sending_status === 'FAILED' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">FAILED</span>
                            )}
                            {order.sending_status === 'PENDING' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white">PENDING</span>
                            )}
                            {(!order.sending_status || order.sending_status === 'NOT_SENT') && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-400 text-white">NOT_SENT</span>
                            )}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            <div className="flex gap-2">
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                View Detail
                              </button>
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow-sm transition-colors"
                                onClick={() => setSelectedPaymentOrderId(order.id)}
                              >
                                Payment Detail
                              </button>
                            </div>
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
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
      {selectedPaymentOrderId && (
        <PaymentDetailModal
          orderId={selectedPaymentOrderId}
          onClose={() => setSelectedPaymentOrderId(null)}
        />
      )}
      
      {/* Toast Notification */}
      {toast.open && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
          <button onClick={() => setToast(t => ({ ...t, open: false }))} className="ml-4 text-white/80 hover:text-white font-bold">×</button>
        </div>
      )}
    </DashboardLayout>
  );
}
 