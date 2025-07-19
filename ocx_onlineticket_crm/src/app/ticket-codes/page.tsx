"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import {
  IconTicket,
  IconSearch,
  IconFilter,
  IconX,
  IconQrcode,
  IconCheck,
  IconClock,
  IconUser,
  IconCalendar,
} from "@tabler/icons-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";

// --- Types ---
interface TicketCode {
  id: string;
  code: string;
  used: boolean;
  used_at: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  ticket_id: string;
  quantity: number;
  price: string;
  order: {
    id: string;
    status: string;
    created_at: string;
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
  };
  ticket: {
    id: string;
    name: string;
    price: string;
    description: string;
  };
  codes: TicketCode[];
}

interface EventTicketData {
  event_id: string;
  event_name: string;
  total_items: number;
  items: OrderItem[];
}

interface Event {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

// Toast Notification Component
function Toast({
  open,
  message,
  type,
  onClose,
}: {
  open: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white font-bold"
      >
        ×
      </button>
    </div>
  );
}

export default function TicketCodesPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [ticketData, setTicketData] = useState<EventTicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has permission to access this page
  const isAuthorized =
    user?.role && ["SUPERADMIN", "OWNER_ORGANIZER"].includes(user.role);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState("");

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  // QR Code Modal state
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRData, setSelectedQRData] = useState<any>(null);

  function showToast(message: string, type: "success" | "error") {
    setToast({ open: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(
      () => setToast((t) => ({ ...t, open: false })),
      3000
    );
  }

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token =
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Error fetching events");
        showToast(err.message || "Error fetching events", "error");
      }
    };

    fetchEvents();
  }, []);

  // Fetch ticket codes by event
  const fetchTicketCodes = async (eventId: string) => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token");

      const res = await fetch(`${API_BASE_URL}/orders/event/${eventId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch ticket codes");

      const data = await res.json();
      setTicketData(data);
    } catch (err: any) {
      const errorMessage = err.message || "Error fetching ticket codes";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle event selection
  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    if (eventId) {
      fetchTicketCodes(eventId);
    } else {
      setTicketData(null);
    }
  };

  // Handle QR code modal
  const openQRModal = (
    codeData: { code: TicketCode; orderItem: OrderItem } | any
  ) => {
    console.log('QR Modal Data:', codeData); // Debug log
    console.log('Code structure:', codeData.code); // Debug code structure
    console.log('Code value:', codeData.code?.code); // Debug code value
    setSelectedQRData(codeData);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedQRData(null);
  };

  // Get unique ticket types for filter
  const ticketTypes = ticketData
    ? [...new Set(ticketData.items.map((item) => item.ticket.name))]
    : [];

  // Filter ticket codes
  const filteredItems =
    ticketData?.items.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.order.user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.order.user.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.order.user.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "" ||
        (selectedStatus === "used" && item.codes.some((code) => code.used)) ||
        (selectedStatus === "unused" && item.codes.some((code) => !code.used));

      const matchesTicketType =
        selectedTicketType === "" || item.ticket.name === selectedTicketType;

      return matchesSearch && matchesStatus && matchesTicketType;
    }) || [];

  // Flatten all codes from filtered items
  const allCodes = filteredItems.flatMap((item) =>
    item.codes.map((code) => ({
      ...code,
      orderItem: item,
    }))
  );

  return (
    <DashboardLayout>
      <div className="px-2 mx-auto w-full max-w-7xl">
        {!isAuthorized ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <IconTicket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Access Denied</p>
            <p className="text-sm mt-2">
              You don't have permission to access this page. Only super admin
              and owner organizer can view ticket codes.
            </p>
          </div>
        ) : (
          <>
            <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <IconTicket className="w-7 h-7 text-blue-500" /> Ticket Codes
              Management
            </h1>

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6">
              {/* Filter Controls */}
              <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Event Selection */}
                  <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                      Select Event
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => handleEventChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">
                        Select event to view ticket codes
                      </option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by email, name, ticket, order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Filters */}
                {ticketData && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* Status Filter */}
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="used">Used</option>
                      <option value="unused">Unused</option>
                    </select>

                    {/* Ticket Type Filter */}
                    <select
                      value={selectedTicketType}
                      onChange={(e) => setSelectedTicketType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Ticket Types</option>
                      {ticketTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    {/* Clear Filters */}
                    {(searchTerm || selectedStatus || selectedTicketType) && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedStatus("");
                          setSelectedTicketType("");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                      >
                        <IconX className="w-4 h-4" />
                        Clear
                      </button>
                    )}
                  </div>
                )}

                {/* Results Count */}
                {ticketData && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Showing {allCodes.length} /{" "}
                    {ticketData.items.flatMap((item) => item.codes).length}{" "}
                    ticket codes
                    {ticketData.event_name &&
                      ` for event: ${ticketData.event_name}`}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                {!selectedEventId ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <IconCalendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      Select event to view ticket codes
                    </p>
                    <p className="text-sm mt-2">
                      Please select an event from the dropdown above to display
                      the ticket codes list
                    </p>
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">
                        Loading ticket codes...
                      </span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-500">
                    <p className="text-lg font-medium">Error loading data</p>
                    <p className="text-sm mt-2">{error}</p>
                  </div>
                ) : allCodes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <IconTicket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No ticket codes found</p>
                    <p className="text-sm mt-2">
                      Try changing filters or select a different event
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                      <thead>
                        <tr className="border-gray-100 border-y dark:border-gray-800">
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            QR Code
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            User
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            Ticket Type
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            Order ID
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            Created At
                          </th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">
                            Used At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {allCodes.map((codeData) => (
                          <tr key={codeData.id}>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openQRModal(codeData)}
                                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded transition-colors"
                                >
                                  <IconQrcode className="w-5 h-5 text-blue-500" />
                                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {codeData.code.substring(0, 8)}...
                                  </span>
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <div className="flex items-center gap-2">
                                {codeData.orderItem.order.user.avatar_url ? (
                                  <Image
                                    src={
                                      codeData.orderItem.order.user.avatar_url
                                    }
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover bg-gray-200"
                                  />
                                ) : (
                                  <IconUser className="w-6 h-6 text-gray-400" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {codeData.orderItem.order.user.first_name}{" "}
                                    {codeData.orderItem.order.user.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {codeData.orderItem.order.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <div>
                                <div className="font-medium">
                                  {codeData.orderItem.ticket.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {Number(
                                    codeData.orderItem.ticket.price
                                  ).toLocaleString("en-US")}{" "}
                                  VND
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {codeData.orderItem.order.id.substring(0, 8)}...
                              </span>
                            </td>
                            <td className="py-3 px-4 align-middle">
                              {codeData.used ? (
                                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                                  <IconCheck className="w-4 h-4" /> Used
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                                  <IconClock className="w-4 h-4" /> Unused
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <span className="text-sm">
                                {new Date(codeData.created_at).toLocaleString(
                                  "en-US"
                                )}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              <span className="text-sm">
                                {codeData.used_at
                                  ? new Date(codeData.used_at).toLocaleString(
                                      "en-US"
                                    )
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

            {/* QR Code Modal */}
            {showQRModal && selectedQRData && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      QR Code Details
                    </h3>
                    <button
                      onClick={closeQRModal}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="bg-white p-1 rounded-lg border">
                        <QRCodeSVG
                          value={selectedQRData.code?.code || selectedQRData.code}
                          size={150}
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    </div>

                    {/* Ticket Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Ticket Code
                      </label>
                      <div className="overflow-hidden font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border">
                        {selectedQRData.code?.code || selectedQRData.code || 'No code available'}
                      </div>
                      {/* Debug info */}
                      {/* <div className="text-xs text-gray-500 mt-1">
                        Debug: {JSON.stringify(selectedQRData.code)}
                      </div> */}
                    </div>

                    {/* User Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        User Information
                      </label>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {selectedQRData.orderItem.order.user.avatar_url ? (
                            <Image
                              src={
                                selectedQRData.orderItem.order.user.avatar_url
                              }
                              alt="avatar"
                              width={24}
                              height={24}
                              className="rounded-full object-cover bg-gray-200"
                            />
                          ) : (
                            <IconUser className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium text-xs">
                              {selectedQRData.orderItem.order.user.first_name}{" "}
                              {selectedQRData.orderItem.order.user.last_name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedQRData.orderItem.order.user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Ticket Information
                      </label>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Ticket Type:
                          </span>
                          <span className="text-xs font-medium">
                            {selectedQRData.orderItem.ticket.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="text-xs font-medium">
                            {Number(
                              selectedQRData.orderItem.ticket.price
                            ).toLocaleString("en-US")}{" "}
                            VND
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Order ID:
                          </span>
                          <span className="text-xs font-mono">
                            {selectedQRData.orderItem.order.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                        Status Information
                      </label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Status:
                          </span>
                          {selectedQRData.code?.used ? (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                              <IconCheck className="w-4 h-4" /> Used
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                              <IconClock className="w-4 h-4" /> Unused
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Created:
                          </span>
                          <span className="text-xs">
                            {new Date(
                              selectedQRData.code.created_at
                            ).toLocaleString("en-US")}
                          </span>
                        </div>
                        {selectedQRData.code.used_at && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Used At:
                            </span>
                            <span className="text-sm">
                              {new Date(
                                selectedQRData.code.used_at
                              ).toLocaleString("en-US")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={closeQRModal}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notification */}
            <Toast
              open={toast.open}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
