"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { API_BASE_URL } from "@/lib/apiConfig";
import Image from "next/image";
import { IconCheck, IconX, IconClock } from "@tabler/icons-react";

// --- Types ---
interface Event {
  id: string;
  title: string;
  description?: string;
  organization_id?: string;
  organization?: {
    id: string;
    name: string;
    logo_url?: string;
  };
}
interface Ticket {
  id: string;
  name: string;
  price: number;
  event_id: string;
}
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}
interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: { ticket_id: string; quantity: number; price: number; ticket?: Ticket }[];
}

export default function TestflightBuyTicketPage() {
  // Step state
  const [step, setStep] = useState<0|1|2|3>(0); // 0: chọn vé, 1: nhập user, 2: thanh toán, 3: done
  // Data
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [ticketSelections, setTicketSelections] = useState<{ [ticketId: string]: number }>({});
  const [userInfo, setUserInfo] = useState<User>({ id: "", email: "", first_name: "", last_name: "", phone: "" });
  const [order, setOrder] = useState<Order|null>(null);
  const [countdown, setCountdown] = useState(600); // 10 phút
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Fetch events
  useEffect(() => {
    setLoadingEvents(true);
    setError("");
    fetch(`${API_BASE_URL}/events`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch events');
        return r.json();
      })
      .then(setEvents)
      .catch(err => {
        console.error('Error fetching events:', err);
        setError('Không thể tải danh sách sự kiện');
      })
      .finally(() => setLoadingEvents(false));
  }, []);
  // Fetch tickets for selected event
  useEffect(() => {
    if (selectedEventId) {
      setLoadingTickets(true);
      setError("");
      fetch(`${API_BASE_URL}/tickets/event/${selectedEventId}`)
        .then(r => {
          if (!r.ok) throw new Error('Failed to fetch tickets');
          return r.json();
        })
        .then(setTickets)
        .catch(err => {
          console.error('Error fetching tickets:', err);
          setError('Không thể tải danh sách vé');
        })
        .finally(() => setLoadingTickets(false));
    } else {
      setTickets([]);
    }
    setTicketSelections({});
  }, [selectedEventId]);

  // Countdown timer
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, countdown]);

  // Step 1: Chọn event và vé
  const handleSelectTicket = (ticketId: string, qty: number) => {
    setTicketSelections(prev => ({ ...prev, [ticketId]: Math.max(0, qty) }));
  };
  const handleCheckout = async () => {
    setError("");
    setLoading(true);
    try {
      // Kiểm tra authentication
      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!token) {
        setError("Vui lòng đăng nhập để tiếp tục");
        setLoading(false);
        return;
      }

      // Tạo order
      const items = Object.entries(ticketSelections)
        .filter(([_, qty]) => qty > 0)
        .map(([ticketId, qty]) => {
          return { ticket_id: ticketId, quantity: qty };
        });
      
      if (!selectedEventId || items.length === 0) {
        setError("Vui lòng chọn event và ít nhất 1 vé.");
        setLoading(false);
        return;
      }

      // Lấy thông tin event để có organization_id
      const selectedEvent = events.find(e => e.id === selectedEventId);
      if (!selectedEvent) {
        setError("Không tìm thấy thông tin sự kiện");
        setLoading(false);
        return;
      }

      // Lấy organization_id từ event
      const organizationId = selectedEvent.organization_id || selectedEvent.organization?.id;
      if (!organizationId) {
        setError("Không tìm thấy thông tin tổ chức");
        setLoading(false);
        return;
      }

      // Tạo order theo API documentation
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          organization_id: organizationId,
          event_id: selectedEventId,
          items: items
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Tạo order thất bại");
      }
      
      const data = await res.json();
      setOrder(data);
      setStep(1);
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  // Step 2: Nhập thông tin user
  const handleUserInfoSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      // Kiểm tra thông tin user
      if (!userInfo.email) {
        setError("Vui lòng nhập email");
        setLoading(false);
        return;
      }

      // Trong testflight flow, user đã đăng nhập nên không cần tạo user mới
      // Chỉ cần validate thông tin và chuyển sang step thanh toán
      setStep(2);
      setCountdown(900);
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // QR code URL (sử dụng VietQR format như paymentmodal.tsx)
  const getQrCodeUrl = () => {
    if (!order) return "";
    // Format VietQR: https://img.vietqr.io/image/VPB-214244527-compact.png?amount=...&addInfo=...&accountName=...
    return `https://img.vietqr.io/image/VPB-214244527-compact.png?amount=${order.total_amount}&addInfo=${encodeURIComponent(`OCX${order.id}`)}&accountName=${encodeURIComponent("PHAM NG CAO TRIET")}`;
  };

  // Render
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white/90">Testflight: Mua vé sự kiện</h1>
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Chọn sự kiện</label>
              <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)} className="w-full px-3 py-2 border rounded">
                <option value="">-- Chọn sự kiện --</option>
                {loadingEvents ? (
                  <option value="">Đang tải sự kiện...</option>
                ) : events.length === 0 ? (
                  <option value="">Không có sự kiện nào</option>
                ) : (
                  events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)
                )}
              </select>
            </div>
            {selectedEventId && (
              <div>
                <label className="block font-medium mb-1">Chọn loại vé & số lượng</label>
                <div className="space-y-2">
                  {loadingTickets ? (
                    <div className="text-center py-4">Đang tải vé...</div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-4">Không có vé nào cho sự kiện này.</div>
                  ) : (
                    tickets.map(ticket => (
                      <div key={ticket.id} className="flex items-center gap-3">
                        <span className="min-w-[120px] font-semibold">{ticket.name}</span>
                        <span className="text-gray-500">{ticket.price.toLocaleString()} VND</span>
                        <input type="number" min={0} max={10} value={ticketSelections[ticket.id] || 0} onChange={e => handleSelectTicket(ticket.id, Number(e.target.value))} className="w-16 px-2 py-1 border rounded" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {error && <div className="text-red-600 font-medium">{error}</div>}
            <button onClick={handleCheckout} disabled={loading || loadingEvents || loadingTickets} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold disabled:opacity-60">{loading ? "Đang xử lý..." : "Checkout"}</button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Nhập thông tin khách hàng</h2>
            <div className="space-y-2">
              <input type="email" placeholder="Email" value={userInfo.email} onChange={e => setUserInfo({ ...userInfo, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
              <input type="text" placeholder="Họ tên" value={userInfo.first_name} onChange={e => setUserInfo({ ...userInfo, first_name: e.target.value })} className="w-full px-3 py-2 border rounded" />
              <input type="text" placeholder="Số điện thoại" value={userInfo.phone} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            {error && <div className="text-red-600 font-medium">{error}</div>}
            <button onClick={handleUserInfoSubmit} disabled={loading} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold disabled:opacity-60">{loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}</button>
          </div>
        )}
        {step === 2 && order && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Thanh toán & giữ vé</h2>
            <div className="flex items-center gap-3">
              <IconClock className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-blue-600">{Math.floor(countdown/60)}:{(countdown%60).toString().padStart(2,"0")} phút</span>
              <span className="text-gray-500">(Giữ vé trong 15 phút)</span>
            </div>
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <div className="mb-2 font-medium">Thông tin chuyển khoản:</div>
              <div className="mb-2">Ngân hàng: <b>VPBank</b></div>
              <div className="mb-2">Số tài khoản: <b>214244527</b></div>
              <div className="mb-2">Nội dung chuyển khoản: <b>{order.id}</b></div>
              <div className="mb-2">Số tiền: <b>{order.total_amount.toLocaleString()} VND</b></div>
              <div className="flex items-center gap-4 mt-4">
                <Image src={getQrCodeUrl()} alt="QR code" width={120} height={120} className="border rounded bg-white" />
                <span className="text-xs text-gray-500">Quét QR để chuyển khoản nhanh</span>
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              <ul className="list-disc ml-6">
                <li>Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống tự động xác nhận.</li>
                <li>Sau khi thanh toán thành công, vé sẽ được gửi về email của bạn.</li>
                <li>Nếu hết thời gian giữ vé, đơn hàng sẽ bị huỷ tự động.</li>
              </ul>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center py-12">
            <IconCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <div className="text-xl font-semibold mb-2">Đặt vé thành công!</div>
            <div className="text-gray-600">Vé sẽ được gửi về email của bạn sau khi thanh toán thành công.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 