"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import { Tab } from "@headlessui/react";
import { IconMail, IconTicket, IconCheck, IconX, IconUser, IconQrcode, IconClock, IconSend, IconSquareCheck, IconSearch, IconFilter } from "@tabler/icons-react";
import { generateTicketQRCode } from "@/lib/qrCodeGenerator";
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
  event?: { title?: string };
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

// --- Helper: Send email via server-side API route ---
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

// Helper function to generate HTML content for ticket
async function generateTicketHTML(ticketData: any): Promise<string> {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Vé Điện Tử - ${ticketData.eventTitle}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        .title {
          font-size: 24px;
          color: #2563eb;
          margin: 0;
        }
        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 10px 0 0 0;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 15px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .label {
          font-weight: bold;
          color: #374151;
        }
        .value {
          color: #1f2937;
        }
        .ticket-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }
        .ticket-name {
          font-size: 14px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .ticket-meta {
          font-size: 10px;
          color: #6b7280;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 10px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">🎫 Vé Điện Tử</h1>
        <p class="subtitle">Ớt Cay Xè Studio</p>
      </div>
      
      <div class="section">
        <h2 class="section-title">📋 Thông Tin Đơn Hàng</h2>
        <div class="info-row">
          <span class="label">Mã đơn hàng:</span>
          <span class="value">${ticketData.orderId}</span>
        </div>
        <div class="info-row">
          <span class="label">Sự kiện:</span>
          <span class="value">${ticketData.eventTitle}</span>
        </div>
        <div class="info-row">
          <span class="label">Tổ chức:</span>
          <span class="value">${ticketData.organizationName}</span>
        </div>
        <div class="info-row">
          <span class="label">Khách hàng:</span>
          <span class="value">${ticketData.user.firstName} ${ticketData.user.lastName}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">${ticketData.user.email}</span>
        </div>
        <div class="info-row">
          <span class="label">Tổng tiền:</span>
          <span class="value">${ticketData.totalAmount.toLocaleString('vi-VN')} VND</span>
        </div>
        <div class="info-row">
          <span class="label">Ngày đặt:</span>
          <span class="value">${new Date(ticketData.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">🎫 Chi Tiết Vé</h2>
        ${ticketData.orderItems.map((item: any) => `
          <div class="ticket-item">
            <div class="ticket-name">${item.ticketName}</div>
            <div class="ticket-meta">Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString('vi-VN')} VND</div>
            ${item.code ? `<div class="ticket-meta">Mã vé: ${item.code}</div>` : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="footer">
        <p>Cảm ơn bạn đã sử dụng dịch vụ của Ớt Cay Xè Studio!</p>
        <p>Chúc bạn có một trải nghiệm tuyệt vời tại sự kiện.</p>
      </div>
    </body>
    </html>
  `;
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

  // State for toast
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  function showToast(message: string, type: 'success' | 'error') {
    setToast({ open: true, message, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(t => ({ ...t, open: false })), 3000);
  }

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
      
      const order = orders.find((o) => o.id === oid);
      if (!order || !order.user?.email) {
        updates[oid] = "fail";
        setSendingOrder((prev) => ({ ...prev, ...updates }));
        await updateOrderSendingStatus(oid, "FAILED");
        failCount++;
        continue;
      }
      // Generate QR codes for ticket items
      const orderItemsWithQR = await Promise.all(
        (order.order_items || []).map(async (item) => {
          let qrCode = "";
          if (item.code) {
            try {
              qrCode = await generateTicketQRCode(item.code);
            } catch (error) {
              console.error('Error generating QR code for item:', item.code, error);
            }
          }
          
          return {
            ticketName: item.ticket?.name || "Vé",
            quantity: item.quantity,
            price: Number(item.price),
            code: item.code || "",
            qrCode: qrCode,
          };
        })
      );

      // Prepare ticket data for PDF generation
      const ticketData = {
        orderId: order.id,
        eventTitle: order.event?.title || "Sự kiện",
        organizationName: order.organization?.name || "N/A",
        totalAmount: Number(order.total_amount),
        createdAt: order.created_at,
        user: {
          firstName: order.user?.first_name || "",
          lastName: order.user?.last_name || "",
          email: order.user?.email || "",
        },
        orderItems: orderItemsWithQR,
      };

      // Compose email
      const subject = `Vé điện tử - ${order.event?.title || "Sự kiện"} - Order #${order.id}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🎫 Vé Điện Tử</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Ớt Cay Xè Studio</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Xin chào ${order.user?.first_name || ""} ${order.user?.last_name || ""}!</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              Cảm ơn bạn đã đặt vé cho sự kiện <strong>${order.event?.title || "Sự kiện"}</strong>.
              Vui lòng xem file PDF đính kèm để xem chi tiết vé của bạn.
            </p>
          </div>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📱 Hướng Dẫn Sử Dụng</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px;">
              <li>Lưu file PDF này để làm bằng chứng đặt vé</li>
              <li>Hiển thị QR Code khi check-in tại sự kiện</li>
              <li>Mỗi QR Code chỉ sử dụng được một lần</li>
              <li>Liên hệ hỗ trợ nếu có vấn đề</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Cảm ơn bạn đã sử dụng dịch vụ của <strong>Ớt Cay Xè Studio</strong>!<br>
              Chúc bạn có một trải nghiệm tuyệt vời tại sự kiện.
            </p>
          </div>
        </div>
      `;
      
      // Send email with PDF attachment
      const ok = await sendResendEmail({ to: order.user.email, subject, html, ticketData });
      updates[oid] = ok ? "success" : "fail";
      setSendingOrder((prev) => ({ ...prev, ...updates }));
      
      // Update status based on result
      await updateOrderSendingStatus(oid, ok ? "SENT" : "FAILED");
      if (ok) successCount++; else failCount++;
    }
    if (ids.length === 1) {
      showToast(successCount ? 'Gửi vé thành công!' : 'Gửi vé thất bại!', successCount ? 'success' : 'error');
    } else {
      showToast(`Đã gửi thành công ${successCount}/${ids.length} vé. ${failCount ? failCount + ' thất bại.' : ''}`, successCount === ids.length ? 'success' : 'error');
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
      showToast(successCount ? 'Gửi email thành công!' : 'Gửi email thất bại!', successCount ? 'success' : 'error');
    } else {
      showToast(`Đã gửi thành công ${successCount}/${selectedUserIds.length} email. ${failCount ? failCount + ' thất bại.' : ''}`, successCount === selectedUserIds.length ? 'success' : 'error');
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
              { label: <><IconTicket className="w-5 h-5 inline mr-1" /> Gửi vé điện tử</>, key: 0 },
              { label: <><IconUser className="w-5 h-5 inline mr-1" /> Gửi email hàng loạt</>, key: 1 },
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
            {/* Tab 1: Gửi vé điện tử */}
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
                        placeholder="Tìm kiếm theo email, tên, event, organization..."
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
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Tất cả Events</option>
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
                        <option value="">Tất cả Organizations</option>
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
                        <option value="">Tất cả Status</option>
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
                    Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
                  </div>
                </div>
                
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-2">
                  <button
                    onClick={handleSelectAllOrders}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium h-10"
                  >
                    <IconSquareCheck className="w-5 h-5" />
                    {selectedOrderIds.length === filteredOrders.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                  <button
                    onClick={() => setConfirmBulkOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold h-10 disabled:opacity-50"
                    disabled={selectedOrderIds.length === 0}
                  >
                    <IconSend className="w-5 h-5" />
                    Gửi ticket
                  </button>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6 overflow-x-auto">
                  <table className="table-fixed w-full min-w-[1300px] divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr className="border-gray-100 border-y dark:border-gray-800">
                        <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80"></th>
                        <th className="w-[300px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">User</th>
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
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-3 px-4 align-middle">
                            <input type="checkbox" checked={selectedOrderIds.includes(order.id)} onChange={() => handleSelectOrder(order.id)} />
                          </td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[280px]">
                            <div className="flex items-center gap-2">
                              {order.user?.avatar_url ? (
                                <Image src={order.user.avatar_url} alt="avatar" width={32} height={32} className="rounded-full object-cover bg-gray-200" />
                              ) : (
                                <IconUser className="w-6 h-6 text-gray-400" />
                              )}
                              <span className="max-w-[250px] whitespace-nowrap text-ellipsis">{order.user?.email || "N/A"}</span>
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
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-colors"
                              onClick={() => setConfirmOrderId(order.id)}
                              disabled={sendingOrder[order.id] === "pending"}
                            >
                              Gửi lại vé
                            </button>
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
            {/* Tab 2: Gửi email hàng loạt */}
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
                        placeholder="Tìm kiếm theo email, tên, SĐT..."
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
                        <option value="">Tất cả Roles</option>
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
                        <option value="">Tất cả Verified</option>
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
                    Hiển thị {filteredUsers.length} / {users.length} users
                  </div>
                </div>
                
                <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-2">
                  <button 
                    onClick={handleSelectAllUsers} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium h-10"
                  >
                    <IconSquareCheck className="w-5 h-5" />
                    {selectedUserIds.length === filteredUsers.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                  <button 
                    onClick={() => setConfirmBulkMailOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold h-10 disabled:opacity-50" 
                    disabled={selectedUserIds.length === 0 || !bulkMailContent}
                  >
                    <IconSend className="w-5 h-5" />
                    Gửi email
                  </button>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                  <div className="mb-4">
                    <label className="block font-medium mb-1">Tiêu đề email</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={bulkMailSubject} onChange={e => setBulkMailSubject(e.target.value)} />
                    <label className="block font-medium mb-1">Nội dung email (HTML)</label>
                    <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={bulkMailContent} onChange={e => setBulkMailContent(e.target.value)} placeholder="Nhập nội dung email (có thể dùng HTML)"></textarea>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table-fixed w-full min-w-[900px] divide-y divide-gray-100 dark:divide-gray-800">
                      <thead>
                        <tr className="border-gray-100 border-y dark:border-gray-800">
                          <th className="w-[40px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80"></th>
                          <th className="w-[250px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Email</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Họ tên</th>
                          <th className="w-[120px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">SĐT</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Role</th>
                          <th className="w-[100px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Verified</th>
                          <th className="w-[150px] py-3 px-4 text-left font-semibold text-gray-700 text-sm dark:text-white/80">Sending status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 px-4 align-middle">
                              <input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => handleSelectUser(user.id)} />
                            </td>
                            <td className="py-3 px-4 text-gray-800 dark:text-white/90 align-middle min-w-[250px]">
                              <div className="flex items-center gap-2">
                                {user.avatar_url ? (
                                  <Image src={user.avatar_url} alt="avatar" width={32} height={32} className="rounded-full object-cover bg-gray-200" />
                                ) : (
                                  <IconUser className="w-6 h-6 text-gray-400" />
                                )}
                                <span>{user.email}</span>
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
                              {sendingUser[user.id] === "success" && <span className="text-green-600 flex items-center gap-1"><IconCheck className="w-4 h-4" /> Đã gửi</span>}
                              {sendingUser[user.id] === "fail" && <span className="text-red-600 flex items-center gap-1"><IconX className="w-4 h-4" /> Lỗi</span>}
                              {sendingUser[user.id] === "pending" && <span className="text-blue-600 flex items-center gap-1">Đang gửi...</span>}
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
          message={`Bạn chắc chắn muốn gửi ${selectedOrderIds.length} email vé điện tử?`}
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
          message={`Bạn chắc chắn muốn gửi lại vé cho đơn hàng này?`}
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
          message={`Bạn chắc chắn muốn gửi ${selectedUserIds.length} email hàng loạt?`}
          loading={modalLoading}
        />
        <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))} />
      </div>
    </DashboardLayout>
  );
} 