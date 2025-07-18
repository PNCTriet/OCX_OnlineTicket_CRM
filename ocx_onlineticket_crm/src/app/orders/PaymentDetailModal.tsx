import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/apiConfig";
import { IconCreditCard, IconUser, IconX, IconCheck, IconClock, IconAlertCircle } from "@tabler/icons-react";
import Image from "next/image";

interface PaymentDetailModalProps {
  orderId: string;
  onClose: () => void;
}

interface PaymentDetail {
  id: string;
  order_id: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  currency: string;
  transaction_id?: string;
  payment_date?: string;
  gateway_response?: string;
  created_at: string;
  updated_at: string;
}

const paymentStatusColor = (status?: string) => {
  switch ((status || "").toUpperCase()) {
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "PROCESSING":
      return "bg-blue-500 text-white";
    case "COMPLETED":
      return "bg-green-500 text-white";
    case "FAILED":
      return "bg-red-500 text-white";
    case "CANCELLED":
      return "bg-gray-400 text-white";
    case "REFUNDED":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const paymentMethodIcon = (method?: string) => {
  switch ((method || "").toLowerCase()) {
    case "credit_card":
      return "💳";
    case "bank_transfer":
      return "🏦";
    case "paypal":
      return "📧";
    case "momo":
      return "💜";
    case "vnpay":
      return "🇻🇳";
    case "zalopay":
      return "💙";
    default:
      return "💳";
  }
};

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ orderId, onClose }) => {
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
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
    const fetchPaymentData = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }
      try {
        // Fetch payment detail - using correct API endpoint
        const paymentRes = await fetch(`${API_BASE_URL}/orders/${orderId}/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!paymentRes.ok) {
          if (paymentRes.status === 404) {
            setPayment(null);
            return;
          }
          throw new Error("Failed to fetch payment detail");
        }
        const paymentsData = await paymentRes.json();
        // Get the first payment (assuming one payment per order)
        const paymentData = Array.isArray(paymentsData) && paymentsData.length > 0 ? paymentsData[0] : null;
        setPayment(paymentData);
      } catch (err: any) {
        setError(err.message || "Error fetching payment detail");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchPaymentData();
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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all"
        onClick={onClose}
      />
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-0 animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl z-20"
          onClick={onClose}
          aria-label="Close"
        >
          <IconX className="w-7 h-7" />
        </button>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <IconCreditCard className="w-7 h-7 text-green-500" /> Payment Detail
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : !payment ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Payment information not found.</div>
          ) : (
            <>
              {/* Payment Info */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-8">
                <div className="px-5 py-4 sm:px-6 sm:py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Method */}
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{paymentMethodIcon(payment.payment_method)}</div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Payment Method</div>
                        <div className="font-semibold text-gray-800 dark:text-white/90 capitalize">
                          {payment.payment_method?.replace('_', ' ') || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {payment.payment_status === "COMPLETED" && <IconCheck className="w-5 h-5 text-green-500" />}
                        {payment.payment_status === "PENDING" && <IconClock className="w-5 h-5 text-yellow-500" />}
                        {payment.payment_status === "FAILED" && <IconAlertCircle className="w-5 h-5 text-red-500" />}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColor(payment.payment_status)}`}>
                          {payment.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Amount</div>
                      <div className="font-bold text-2xl text-green-600 dark:text-green-400">
                        {Number(payment.amount).toLocaleString("vi-VN", { 
                          style: "currency", 
                          currency: payment.currency || "VND" 
                        })}
                      </div>
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</div>
                      <div className="font-mono text-sm text-gray-700 dark:text-white/80">
                        {payment.transaction_id || "N/A"}
                      </div>
                    </div>

                    {/* Payment Date */}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Payment Date</div>
                      <div className="text-gray-700 dark:text-white/80">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleString() : "N/A"}
                      </div>
                    </div>

                    {/* Created At */}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Created At</div>
                      <div className="text-gray-700 dark:text-white/80">
                        {payment.created_at ? new Date(payment.created_at).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gateway Response */}
              {payment.gateway_response && (
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="px-5 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90 mb-3">Gateway Response</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {payment.gateway_response}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal; 