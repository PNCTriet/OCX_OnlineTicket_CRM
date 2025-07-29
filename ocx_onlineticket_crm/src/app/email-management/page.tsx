"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import { Tab } from "@headlessui/react";
import { IconMail, IconTicket, IconCheck, IconX, IconUser, IconQrcode, IconClock, IconSend, IconSquareCheck, IconSearch, IconFilter } from "@tabler/icons-react";
import { useAuth } from '@/hooks/useAuth';

import Image from "next/image";

const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;
const RESEND_FROM = process.env.NEXT_PUBLIC_RESEND_FROM || "Ớt Cay Xè <noreply@otcayxe.com>";

// --- Types ---
interface OrderItem {
  id: string;
  ticket_id: string;
  quantity: number;
  price: number;
  code?: string; // Ticket code for QR generation
  qr_code?: string;
  ticket?: { name?: string };
}
interface Order {
  id: string;
  user?: { email?: string; first_name?: string; last_name?: string; avatar_url?: string };
  organization?: { name?: string };
  event?: { id?: string; title?: string };
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
  sending_status?: "SENT" | "FAILED" | "PENDING" | "NOT_SENT";
}
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
  role?: string;
  is_verified?: boolean;
}

// --- Helper: Send ticket email via backend API ---
async function sendTicketEmail(orderId: string) {
  try {
    console.log('Sending ticket email for order:', orderId);

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error('No access token found');
      return false;
    }

    // Call backend API to send ticket email
    const res = await fetch(`${API_BASE_URL}/email/send-tickets/${orderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API response status:', res.status);
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('API error:', res.status, errorData);
      return false;
    }

    const result = await res.json();
    console.log('Ticket email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send ticket email:', error);
    return false;
  }
}

// --- Helper: Send confirmation email via backend API ---
async function sendConfirmEmail(orderId: string) {
  try {
    console.log('Sending confirmation email for order:', orderId);

    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) {
      console.error('No access token found');
      return false;
    }

    // Call backend API to send confirmation email
    const res = await fetch(`${API_BASE_URL}/email/send-confirmation/${orderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('API response status:', res.status);
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('API error:', res.status, errorData);
      return false;
    }

    const result = await res.json();
    console.log('Confirmation email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

// --- Helper: Send email via server-side API route (for bulk email) ---
async function sendResendEmail({ to, subject, html, ticketData }: { to: string; subject: string; html: string; ticketData?: any }) {
  try {
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Has ticketData:', !!ticketData);

    // Send email via our server-side API route
    const res = await fetch('/api/send-email-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        ticketData,
      }),
    });

    console.log('API response status:', res.status);
    
    if (!res.ok) {
      const errorData = await res.text();
      console.error('API error:', res.status, errorData);
      return false;
    }

    const result = await res.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}



// --- Helper: Update order sending status ---
const updateOrderSendingStatus = async (orderId: string, status: string) => {
  try {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) return false;

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/sending-status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sending_status: status }),
    });

    if (res.ok) {
      // Update local state
      // This function is called from handleSendTickets, which updates the state.
      // No need to update state here directly.
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to update sending status:", error);
    return false;
  }
};



// Modal Confirm Component
function ConfirmModal({ open, onClose, onConfirm, message, loading }: { open: boolean; onClose: () => void; onConfirm: () => void; message: string; loading?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 min-w-[320px] max-w-[90vw]">
        <div className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">Xác nhận gửi email</div>
        <div className="mb-6 text-gray-700 dark:text-gray-200">{message}</div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium" disabled={loading}>Huỷ</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60" disabled={loading}>
            {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function Toast({ open, message, type, onClose }: { open: boolean; message: string; type: 'success' | 'error'; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white font-bold">×</button>
    </div>
  );
}

// --- Main Page ---
export default function EmailManagementPage() {
  const { user } = useAuth();
  
  // Check if user is super admin
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  
  // Tab 1: Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [sendingOrder, setSendingOrder] = useState<{ [id: string]: "pending" | "success" | "fail" }>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedSendingStatus, setSelectedSendingStatus] = useState("");
  
  // Tab 2: Users
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [bulkMailContent, setBulkMailContent] = useState<string>("");
  const [sendingUser, setSendingUser] = useState<{ [id: string]: "pending" | "success" | "fail" }>({});
  const [bulkMailSubject, setBulkMailSubject] = useState<string>("Thông báo từ Howls Studio");
  
  // Filter states for users
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [selectedUserVerified, setSelectedUserVerified] = useState("");

  // State for confirm modals
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);
  const [confirmBulkMailOpen, setConfirmBulkMailOpen] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState<string|null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Auto send settings
  const [autoSendTickets, setAutoSendTickets] = useState(false);
  const [autoSendConfirm, setAutoSendConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventSettings, setEventSettings] = useState<any>(null);

  // State for toast
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

  // Fetch orders PAID
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      // Only PAID
      const paidOrders = data.filter((o: Order) => o.status === "PAID");
      // Fetch order_items for each order
      const ordersWithItems = await Promise.all(
        paidOrders.map(async (order: Order) => {
          const itemsRes = await fetch(`${API_BASE_URL}/orders/${order.id}/items`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          let order_items: OrderItem[] = [];
          if (itemsRes.ok) order_items = await itemsRes.json();
          return { ...order, order_items };
        })
      );
      setOrders(ordersWithItems);
    };
    fetchOrders();
  }, []);

  // Fetch event settings when event is selected
  useEffect(() => {
    const fetchEventSettings = async () => {
      if (!selectedEventId) {
        setEventSettings(null);
        setAutoSendTickets(false);
        setAutoSendConfirm(false);
        return;
      }

      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/events/${selectedEventId}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const settings = await res.json();
          setEventSettings(settings);
          setAutoSendTickets(settings.auto_send_ticket_email || false);
          setAutoSendConfirm(settings.auto_send_confirm_email || false);
        } else {
          console.error('Failed to fetch event settings');
          setEventSettings(null);
          setAutoSendTickets(false);
          setAutoSendConfirm(false);
        }
      } catch (error) {
        console.error('Error fetching event settings:', error);
        setEventSettings(null);
        setAutoSendTickets(false);
        setAutoSendConfirm(false);
      }
    };

    fetchEventSettings();
  }, [selectedEventId]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // Get unique values for filters
  const events = [...new Set(orders.map(o => o.event?.title).filter(Boolean))];
  const organizations = [...new Set(orders.map(o => o.organization?.name).filter(Boolean))];
  const sendingStatuses = ["SENT", "FAILED", "PENDING", "NOT_SENT"];
  
  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === "" || order.event?.title === selectedEvent;
    const matchesOrganization = selectedOrganization === "" || order.organization?.name === selectedOrganization;
    const matchesSendingStatus = selectedSendingStatus === "" || order.sending_status === selectedSendingStatus;
    
    return matchesSearch && matchesEvent && matchesOrganization && matchesSendingStatus;
  });

  // Get unique values for user filters
  const userRoles = [...new Set(users.map(u => u.role).filter(Boolean))];
  const userVerifiedOptions = ["true", "false"];
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearchTerm === "" || 
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    const matchesRole = selectedUserRole === "" || user.role === selectedUserRole;
    const matchesVerified = selectedUserVerified === "" || String(user.is_verified) === selectedUserVerified;
    
    return matchesSearch && matchesRole && matchesVerified;
  });

  // --- Tab 1: Send Ticket Email ---
  const handleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) => prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]);
  };
  const handleSelectAllOrders = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      // Deselect all filtered orders
      setSelectedOrderIds([]);
    } else {
      // Select all filtered orders
      const filteredOrderIds = filteredOrders.map(o => o.id);
      setSelectedOrderIds(filteredOrderIds);
    }
  };
  // --- Helper: Update event settings ---
  const updateEventSettings = async (eventId: string, settings: { auto_send_ticket_email: boolean; auto_send_confirm_email: boolean }) => {
    try {
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) return false;

      const res = await fetch(`${API_BASE_URL}/events/${eventId}/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const updatedSettings = await res.json();
        setEventSettings(updatedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update event settings:", error);
      return false;
    }
  };

  const handleSendTickets = async (orderIds?: string[]) => {
    const ids = orderIds || selectedOrderIds;
    let successCount = 0;
    let failCount = 0;
    const updates: typeof sendingOrder = {};
    
    for (const oid of ids) {
      updates[oid] = "pending";
      setSendingOrder((prev) => ({ ...prev, ...updates }));
      
      // Update status to SENDING
      await updateOrderSendingStatus(oid, "SENDING");
      
      // Send based on auto settings
      let ok = false;
      if (autoSendTickets) {
        // Send ticket email
        ok = await sendTicketEmail(oid);
      } else if (autoSendConfirm) {
        // Send confirmation email
        ok = await sendConfirmEmail(oid);
      } else {
        // Default: send ticket email
        ok = await sendTicketEmail(oid);
      }
      
      updates[oid] = ok ? "success" : "fail";
      setSendingOrder((prev) => ({ ...prev, ...updates }));
      
      // Update status based on result
      await updateOrderSendingStatus(oid, ok ? "SENT" : "FAILED");
      if (ok) successCount++; else failCount++;
    }
    
    if (ids.length === 1) {
      showToast(successCount ? 'Email sent successfully!' : 'Failed to send email!', successCount ? 'success' : 'error');
    } else {
      showToast(`Successfully sent ${successCount}/${ids.length} emails. ${failCount ? failCount + ' failed.' : ''}`, successCount === ids.length ? 'success' : 'error');
    }
  };

  // --- Tab 2: Bulk Email ---
  const handleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]);
  };
  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredUsers.length) setSelectedUserIds([]);
    else setSelectedUserIds(filteredUsers.map((u) => u.id));
  };
  const handleSendBulkMail = async () => {
    const updates: typeof sendingUser = {};
    let successCount = 0;
    let failCount = 0;
    
    for (const uid of selectedUserIds) {
      updates[uid] = "pending";
      setSendingUser((prev) => ({ ...prev, ...updates }));
      const user = users.find((u) => u.id === uid);
      if (!user?.email) {
        updates[uid] = "fail";
        setSendingUser((prev) => ({ ...prev, ...updates }));
        failCount++;
        continue;
      }
      const ok = await sendResendEmail({ to: user.email, subject: bulkMailSubject, html: bulkMailContent });
      updates[uid] = ok ? "success" : "fail";
      setSendingUser((prev) => ({ ...prev, ...updates }));
      if (ok) successCount++; else failCount++;
    }
    
    // Show toast notification
    if (selectedUserIds.length === 1) {
      showToast(successCount ? 'Email sent successfully!' : 'Failed to send email!', successCount ? 'success' : 'error');
    } else {
      showToast(`Successfully sent ${successCount}/${selectedUserIds.length} emails. ${failCount ? failCount + ' failed.' : ''}`, successCount === selectedUserIds.length ? 'success' : 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="px-2 mx-auto w-full max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <IconMail className="w-7 h-7 text-blue-500" /> Email Management
        </h1>
        <Tab.Group>
          <Tab.List className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {[
              { label: <><IconTicket className="w-5 h-5 inline mr-1" /> Send Ticket Emails</>, key: 0 },
              { label: <><IconUser className="w-5 h-5 inline mr-1" /> Bulk Email</>, key: 1 },
            ].map((tab, idx) => (
              <Tab key={tab.key} className={({ selected }) =>
                `px-5 py-2.5 text-sm font-semibold rounded-t-lg focus:outline-none transition-all duration-200
                ${selected
                  ? 'bg-white dark:bg-gray-900 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `
              }>
                {tab.label}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {/* Tab 1: Send Ticket Emails */}
            <Tab.Panel>
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6">
                {/* Filter Controls */}
                <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by email, name, event, organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                      {/* Event Filter */}
                      <select
                        value={selectedEvent}
                        onChange={(e) => {
                          setSelectedEvent(e.target.value);
                          // Find event ID for settings
                          const event = orders.find(o => o.event?.title === e.target.value);
                          setSelectedEventId(event?.event?.id || "");
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Events</option>
                        {events.map(event => (
                          <option key={event} value={event}>{event}</option>
                        ))}
                      </select>
                      
                      {/* Organization Filter */}
                      <select
                        value={selectedOrganization}
                        onChange={(e) => setSelectedOrganization(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Organizations</option>
                        {organizations.map(org => (
                          <option key={org} value={org}>{org}</option>
                        ))}
                      </select>
                      
                      {/* Sending Status Filter */}
                      <select
                        value={selectedSendingStatus}
                        onChange={(e) => setSelectedSendingStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Status</option>
                        {sendingStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      
                      {/* Clear Filters */}
                      {(searchTerm || selectedEvent || selectedOrganization || selectedSendingStatus) && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedEvent("");
                            setSelectedOrganization("");
                            setSelectedSendingStatus("");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          <IconX className="w-4 h-4" />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Results Count */}
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredOrders.length} / {orders.length} orders
                  </div>
                </div>
                
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-2">
                  <button
                    onClick={handleSelectAllOrders}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium h-10"
                  >
                    <IconSquareCheck className="w-5 h-5" />
                    {selectedOrderIds.length === filteredOrders.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={() => setConfirmBulkOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold h-10 disabled:opacity-50"
                    disabled={selectedOrderIds.length === 0}
                  >
                    <IconSend className="w-5 h-5" />
                    Send Tickets
                  </button>
                  
                  {/* Auto Send Settings */}
                  <div className="flex items-center gap-4 ml-auto">
                    {selectedEventId ? (
                      isSuperAdmin ? (
                        <>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={autoSendTickets}
                              onChange={async (e) => {
                                const newValue = e.target.checked;
                                setAutoSendTickets(newValue);
                                
                                if (selectedEventId && eventSettings) {
                                  const success = await updateEventSettings(selectedEventId, {
                                    auto_send_ticket_email: newValue,
                                    auto_send_confirm_email: autoSendConfirm
                                  });
                                
                                  if (success) {
                                    showToast('Event settings updated successfully!', 'success');
                                  } else {
                                    showToast('Failed to update event settings!', 'error');
                                    // Revert the change if update failed
                                    setAutoSendTickets(!newValue);
                                  }
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Auto Send Tickets</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={autoSendConfirm}
                              onChange={async (e) => {
                                const newValue = e.target.checked;
                                setAutoSendConfirm(newValue);
                                
                                if (selectedEventId && eventSettings) {
                                  const success = await updateEventSettings(selectedEventId, {
                                    auto_send_ticket_email: autoSendTickets,
                                    auto_send_confirm_email: newValue
                                  });
                                
                                  if (success) {
                                    showToast('Event settings updated successfully!', 'success');
                                  } else {
                                    showToast('Failed to update event settings!', 'error');
                                    // Revert the change if update failed
                                    setAutoSendConfirm(!newValue);
                                  }
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Auto Send Confirm</span>
                          </label>
                        </>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          {eventSettings && (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span className={`px-2 py-1 rounded ${eventSettings.auto_send_ticket_email ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                Auto Tickets: {eventSettings.auto_send_ticket_email ? 'ON' : 'OFF'}
                              </span>
                              <span className={`px-2 py-1 rounded ${eventSettings.auto_send_confirm_email ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                Auto Confirm: {eventSettings.auto_send_confirm_email ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {isSuperAdmin ? 'Select an event to configure auto-send settings' : 'Select an event to view auto-send settings'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6 overflow-x-auto">
                  <table className="table-fixed w-full min-w-[1200px] divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr className="border-gray-100 border-y dark:border-gray-800">
                        <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                        <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80"></th>
                        <th className="w-[280px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">User</th>
                        <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Event</th>
                        <th className="w-[180px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Organization</th>
                        <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Total</th>
                        <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Order Items</th>
                        <th className="w-[140px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Status</th>
                        <th className="w-[250px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Created At</th>
                        <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Actions</th>
                        <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Sending Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredOrders.map((order, idx) => (
                        <tr key={order.id}>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            <input type="checkbox" checked={selectedOrderIds.includes(order.id)} onChange={() => handleSelectOrder(order.id)} />
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[260px]">
                            <div className="flex items-center gap-2">
                              {order.user?.avatar_url ? (
                                <Image src={order.user.avatar_url} alt="avatar" width={32} height={32} className="rounded-full object-cover bg-gray-200" />
                              ) : (
                                <IconUser className="w-6 h-6 text-gray-400" />
                              )}
                                                              <button
                                  onClick={() => copyEmail(order.user?.email || "")}
                                  className="max-w-[220px] text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group relative"
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
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[150px]">
                            <span>{order.event?.title || "N/A"}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[180px]">
                            <span>{order.organization?.name || "N/A"}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            {Number(order.total_amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[200px]">
                            <ul className="list-disc ml-4">
                              {(order.order_items || []).map((item) => (
                                <li key={item.id}>
                                  <span className="font-semibold">{item.ticket?.name || "Vé"}</span> x{item.quantity}
                                  {item.qr_code && (
                                    <span className="inline-block ml-2"><IconQrcode className="w-5 h-5 inline" /></span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-3 px-4 align-middle">
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                              <IconCheck className="w-4 h-4" /> PAID
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                            <span className="text-base text-gray-500 dark:text-gray-300">
                              {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                            </span>
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {(order.sending_status === 'SENT' || order.sending_status === 'FAILED') && (
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
                                onClick={() => setConfirmOrderId(order.id)}
                                disabled={sendingOrder[order.id] === "pending"}
                              >
                                Resend Ticket
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 align-middle">
                            {order.sending_status === 'SENT' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                                <IconCheck className="w-4 h-4" /> SENT
                              </span>
                            )}
                            {order.sending_status === 'FAILED' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-500 text-white">
                                <IconX className="w-4 h-4" /> FAILED
                              </span>
                            )}
                            {order.sending_status === 'PENDING' && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-500 text-white">
                                <IconClock className="w-4 h-4" /> PENDING
                              </span>
                            )}
                            {(!order.sending_status || order.sending_status === 'NOT_SENT') && (
                              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-400 text-white">
                                <IconClock className="w-4 h-4" /> NOT_SENT
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
            {/* Tab 2: Bulk Email */}
            <Tab.Panel>
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6">
                {/* Filter Controls */}
                <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by email, name, phone..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                      {/* Role Filter */}
                      <select
                        value={selectedUserRole}
                        onChange={(e) => setSelectedUserRole(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Roles</option>
                        {userRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      
                      {/* Verified Filter */}
                      <select
                        value={selectedUserVerified}
                        onChange={(e) => setSelectedUserVerified(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Verified</option>
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                      </select>
                      
                      {/* Clear Filters */}
                      {(userSearchTerm || selectedUserRole || selectedUserVerified) && (
                        <button
                          onClick={() => {
                            setUserSearchTerm("");
                            setSelectedUserRole("");
                            setSelectedUserVerified("");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                          <IconX className="w-4 h-4" />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Results Count */}
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredUsers.length} / {users.length} users
                  </div>
                </div>
                
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-2">
                  <button 
                    onClick={handleSelectAllUsers} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium h-10"
                  >
                    <IconSquareCheck className="w-5 h-5" />
                    {selectedUserIds.length === filteredUsers.length ? "Deselect All" : "Select All"}
                  </button>
                  <button 
                    onClick={() => setConfirmBulkMailOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold h-10 disabled:opacity-50" 
                    disabled={selectedUserIds.length === 0 || !bulkMailContent}
                  >
                    <IconSend className="w-5 h-5" />
                    Send Email
                  </button>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                  <div className="mb-4">
                    <label className="block font-medium mb-1">Email Subject</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={bulkMailSubject} onChange={e => setBulkMailSubject(e.target.value)} />
                    <label className="block font-medium mb-1">Email Content (HTML)</label>
                    <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={bulkMailContent} onChange={e => setBulkMailContent(e.target.value)} placeholder="Enter email content (HTML supported)"></textarea>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table-fixed w-full min-w-[800px] divide-y divide-gray-100 dark:divide-gray-800">
                      <thead>
                        <tr className="border-gray-100 border-y dark:border-gray-800">
                          <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">#</th>
                          <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80"></th>
                          <th className="w-[220px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Email</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Họ tên</th>
                          <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">SĐT</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Role</th>
                          <th className="w-[100px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Verified</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Sending status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredUsers.map((user, idx) => (
                          <tr key={user.id}>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 align-middle">
                              <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => handleSelectUser(user.id)} />
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[220px]">
                              <div className="flex items-center gap-2">
                                {user.avatar_url ? (
                                  <Image src={user.avatar_url} alt="avatar" width={32} height={32} className="rounded-full object-cover bg-gray-200" />
                                ) : (
                                  <IconUser className="w-6 h-6 text-gray-400" />
                                )}
                                <button
                                  onClick={() => copyEmail(user.email)}
                                  className="max-w-[180px] text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group relative"
                                  title={`Click to copy: ${user.email}`}
                                >
                                  <span className="block truncate group-hover:underline">
                                    {user.email}
                                  </span>
                                  <div className="absolute left-0 top-full z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {user.email}
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[150px]">{user.first_name || ""} {user.last_name || ""}</td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[120px]">{user.phone || "-"}</td>
                            <td className="py-3 px-4 align-middle">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                user.role === 'SUPERADMIN' ? 'bg-purple-500 text-white' :
                                user.role === 'ADMIN_ORGANIZER' ? 'bg-blue-500 text-white' :
                                user.role === 'OWNER_ORGANIZER' ? 'bg-orange-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {user.role || 'USER'}
                              </span>
                            </td>
                            <td className="py-3 px-4 align-middle">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.is_verified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {user.is_verified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                            <td className="py-3 px-4 align-middle">
                              {sendingUser[user.id] === "success" && <span className="text-green-600 flex items-center gap-1"><IconCheck className="w-4 h-4" /> Sent</span>}
                              {sendingUser[user.id] === "fail" && <span className="text-red-600 flex items-center gap-1"><IconX className="w-4 h-4" /> Error</span>}
                              {sendingUser[user.id] === "pending" && <span className="text-blue-600 flex items-center gap-1">Sending...</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <ConfirmModal
          open={confirmBulkOpen}
          onClose={() => modalLoading ? undefined : setConfirmBulkOpen(false)}
          onConfirm={async () => {
            setModalLoading(true);
            await handleSendTickets();
            setModalLoading(false);
            setConfirmBulkOpen(false);
          }}
          message={`Are you sure you want to send ${selectedOrderIds.length} ticket emails?`}
          loading={modalLoading}
        />
        <ConfirmModal
          open={!!confirmOrderId}
          onClose={() => modalLoading ? undefined : setConfirmOrderId(null)}
          onConfirm={async () => {
            if (confirmOrderId) {
              setModalLoading(true);
              await handleSendTickets([confirmOrderId]);
              setModalLoading(false);
              setConfirmOrderId(null);
            }
          }}
          message={`Are you sure you want to resend the ticket for this order?`}
          loading={modalLoading}
        />
        <ConfirmModal
          open={confirmBulkMailOpen}
          onClose={() => modalLoading ? undefined : setConfirmBulkMailOpen(false)}
          onConfirm={async () => {
            setModalLoading(true);
            await handleSendBulkMail();
            setModalLoading(false);
            setConfirmBulkMailOpen(false);
          }}
          message={`Are you sure you want to send ${selectedUserIds.length} bulk emails?`}
          loading={modalLoading}
        />
        <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
      </div>
    </DashboardLayout>
  );
} 