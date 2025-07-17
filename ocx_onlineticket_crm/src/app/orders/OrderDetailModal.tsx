import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/apiConfig";
import { IconShoppingCart, IconUser, IconTicket, IconX } from "@tabler/icons-react";
import Image from "next/image";

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  order_id: string;
  ticket_id: string;
  quantity: number;
  price: string;
  qr_code?: string | null;
  ticket?: {
    id: string;
    event_id: string;
    name: string;
    description: string;
    price: string;
    total_qty: number;
    sold_qty: number;
    sale_start: string;
    sale_end: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

interface OrderDetail {
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
  reserved_until?: string;
  created_at: string;
  updated_at: string;
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

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }
      try {
        // Fetch order detail
        const orderRes = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!orderRes.ok) throw new Error("Failed to fetch order detail");
        const orderData = await orderRes.json();
        setOrder(orderData);
        // Fetch order items
        const itemsRes = await fetch(`${API_BASE_URL}/orders/${orderId}/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!itemsRes.ok) throw new Error("Failed to fetch order items");
        const itemsData = await itemsRes.json();
        setItems(itemsData);
      } catch (err: any) {
        setError(err.message || "Error fetching order detail");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchData();
  }, [orderId]);

  // Đóng modal khi bấm ESC hoặc click overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-0 animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl z-20"
          onClick={onClose}
          aria-label="Close"
        >
          <IconX className="w-7 h-7" />
        </button>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <IconShoppingCart className="w-7 h-7 text-blue-500" /> Order Detail
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : !order ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Order not found.</div>
          ) : (
            <>
              {/* Order Info */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-8">
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AvatarImg src={order.user?.avatar_url} alt={order.user?.email} />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white/90">
                        {order.user?.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.first_name || ""} {order.user?.last_name || ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:items-end">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Organization: <span className="font-medium text-gray-700 dark:text-white/80">{order.organization?.name || "N/A"}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Event: <span className="font-medium text-gray-700 dark:text-white/80">{order.event?.title || "N/A"}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created: <span className="font-medium text-gray-700 dark:text-white/80">{order.created_at ? new Date(order.created_at).toLocaleString() : "-"}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Reserved Until: <span className="font-medium text-blue-500 dark:text-blue-300">{order.reserved_until ? new Date(order.reserved_until).toLocaleString() : "-"}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status: <span className={`font-semibold px-2 py-1 rounded ${statusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total: <span className="font-bold text-green-600 dark:text-green-400">{Number(order.total_amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Order Items Table */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-2">
                  <IconTicket className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Order Items</h3>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                  {items.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">No order items found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table-fixed w-full min-w-[900px] divide-y divide-gray-100 dark:divide-gray-800">
                        <thead>
                          <tr className="border-gray-100 border-y dark:border-gray-800">
                            <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                            <th className="w-[180px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Ticket</th>
                            <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Quantity</th>
                            <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Price</th>
                            <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">QR Code</th>
                            <th className="w-[200px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Description</th>
                            <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {items.map((item, idx) => (
                            <tr key={item.id}>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">{idx + 1}</td>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[160px]">
                                {item.ticket?.name || "-"}
                              </td>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">{item.quantity}</td>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                {Number(item.price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                              </td>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                                {item.qr_code ? (
                                  <span className="text-xs break-all">{item.qr_code}</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[180px]">
                                {item.ticket?.description || "-"}
                              </td>
                              <td className="py-3 px-4 align-middle">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(item.ticket?.status)}`}>
                                  {item.ticket?.status || "-"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 