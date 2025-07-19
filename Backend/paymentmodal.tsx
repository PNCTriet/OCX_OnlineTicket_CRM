"use client";
import { Ticket } from "../../types/ticket";
import Image from "next/image";
import { useEffect, useState } from "react";

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: (Ticket & { quantity: number })[];
  totalAmount: number;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentRemainingSeconds: number;
  paymentStatus: "pending" | "success" | "error";
  orderNumber: string | null;
  orderDate: string | null;
  orderTime: string | null;
  onPaymentSuccess?: () => void; // Add callback for payment success
};

type PurchaseData = {
  orderId: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  tickets: (Ticket & { quantity: number })[];
  totalAmount: number;
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  purchaseDate: string;
};

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  selectedTickets, 
  totalAmount, 
  userInfo, 
  paymentRemainingSeconds, 
  paymentStatus, 
  orderNumber, 
  orderDate, 
  orderTime,
  onPaymentSuccess 
}: PaymentModalProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  
  // New states for payment checking
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentCheckCountdown, setPaymentCheckCountdown] = useState(60); // 60 seconds
  const [paymentCheckResult, setPaymentCheckResult] = useState<'pending' | 'success' | 'failed'>('pending');
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Add debug log for props
  useEffect(() => {
    console.log('PaymentModal - Props Update:', {
      isOpen,
      selectedTickets,
      totalAmount,
      userInfo,
      paymentRemainingSeconds,
      paymentStatus,
      orderNumber,
      orderDate,
      orderTime
    });
  }, [isOpen, selectedTickets, totalAmount, userInfo, paymentRemainingSeconds, paymentStatus, orderNumber, orderDate, orderTime]);

  // Effect để ngăn cuộn trang chính khi modal mở (di chuyển lên trên)
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Process payment with authentication
  const processPayment = async () => {
    setIsProcessingPayment(true);
    setIsCheckingPayment(true);
    setPaymentCheckCountdown(60);
    setPaymentCheckResult('pending');
    
    try {
      console.log('💳 Processing payment with authentication...');
      
      // Call our authenticated API route
      const response = await fetch('/api/purchase-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets: selectedTickets.filter(t => t.quantity > 0),
          totalAmount,
          userInfo
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Payment processed successfully:', result.data);
        setPurchaseData(result.data);
        
        // Check if payment already exists before starting countdown
        const paymentCheckResponse = await fetch('/api/check-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber: result.data.orderNumber,
            expectedAmount: totalAmount
          }),
        });

        const paymentCheckResult = await paymentCheckResponse.json();

        if (paymentCheckResult.success && paymentCheckResult.paymentReceived) {
          console.log('✅ Payment already confirmed! Sending email immediately.');
          setPaymentCheckResult('success');
          setIsCheckingPayment(false);
          
          // Send email with tickets immediately
          if (result.data) {
            await sendEmailWithTickets(result.data);
          }
        } else {
          console.log('⏳ Payment not found, starting countdown...');
          // Start payment checking with countdown
          startPaymentChecking(result.data.orderNumber, totalAmount);
        }
      } else {
        console.error('❌ Payment failed:', result.error);
        alert(`❌ Thanh toán thất bại: ${result.error}`);
        setIsCheckingPayment(false);
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert('❌ Có lỗi khi xử lý thanh toán. Vui lòng thử lại sau.');
      setIsCheckingPayment(false);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Start payment checking with countdown
  const startPaymentChecking = (orderNumber: string, expectedAmount: number) => {
    console.log('🔍 Starting payment check for:', orderNumber, 'Amount:', expectedAmount);
    
    // Start countdown
    const interval = setInterval(() => {
      setPaymentCheckCountdown(prev => {
        if (prev <= 1) {
          // Time's up, payment failed
          clearInterval(interval);
          setPaymentCheckResult('failed');
          setIsCheckingPayment(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setCheckInterval(interval);

    // Check payment every 3 seconds
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/check-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderNumber,
            expectedAmount
          }),
        });

        const result = await response.json();

        if (result.success && result.paymentReceived) {
          console.log('✅ Payment confirmed via webhook!');
          clearInterval(interval);
          clearInterval(checkInterval);
          setPaymentCheckResult('success');
          setIsCheckingPayment(false);
          
          // Send email with tickets
          if (purchaseData) {
            await sendEmailWithTickets(purchaseData);
          }
        }
      } catch (error) {
        console.error('❌ Error checking payment:', error);
      }
    }, 3000);

    // Clean up intervals on component unmount
    return () => {
      if (interval) clearInterval(interval);
      if (checkInterval) clearInterval(checkInterval);
    };
  };

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [checkInterval]);

  // Send real email with electronic tickets using Resend API
  const sendEmailWithTickets = async (purchaseData?: PurchaseData) => {
    try {
      const orderData = purchaseData || { orderNumber: orderNumber || '' };
      
      // Log the data being sent for verification
      console.log('📧 Preparing to send email with data:');
      console.log('👤 User Info:', userInfo);
      console.log('🎫 Selected Tickets:', selectedTickets.filter(t => t.quantity > 0));
      console.log('🔢 Order Details:', { orderNumber: orderData.orderNumber, orderDate, orderTime, totalAmount });
      
      // Prepare email data
      const emailData = {
        to: userInfo.email,
        subject: `🎫 Vé điện tử Ớt Cay Xè - Đơn hàng #${orderData.orderNumber}`,
        tickets: selectedTickets.filter(t => t.quantity > 0),
        customerInfo: userInfo,
        orderNumber: orderData.orderNumber,
        orderDate: orderDate,
        orderTime: orderTime,
        totalAmount: totalAmount
      };

      console.log('📧 Sending email to:', userInfo.email);
      console.log('📧 Email subject:', emailData.subject);

      // Call our API route to send email
              const response = await fetch('/api/send-email-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Email sent successfully:', result.data);
        setEmailSent(true);
        
        // Call success callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        console.error('❌ Failed to send email:', result.error);
        alert('❌ Có lỗi khi gửi email. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('❌ Có lỗi khi gửi email. Vui lòng thử lại sau.');
    }
  };

  if (!isOpen) return null;

  // Debug values
  console.log('Debug QR values:', {
    orderNumber,
    orderDate,
    orderTime,
    totalAmount
  });

  // Chỉ tạo qrUrl khi các giá trị orderNumber, orderDate, orderTime đã có
  const qrUrl = (orderNumber && orderDate && orderTime)
    ? `https://img.vietqr.io/image/VPB-214244527-compact.png?amount=${totalAmount}&addInfo=${encodeURIComponent(orderNumber)}&accountName=${encodeURIComponent("PHAM NG CAO TRIET")}`
    : "/images/qr_code_placeholder.png";

  console.log('Generated QR URL:', qrUrl);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-xl p-6 md:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Thanh toán</h2>
          <button onClick={onClose} className="text-white hover:text-zinc-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: QR Code */}
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <div className="w-64 h-64 relative mb-4 flex items-center justify-center">
              <Image
                src={qrUrl}
                alt="QR Code chuyển khoản ngân hàng"
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  console.error('QR Image load error:', e);
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/qr_code_placeholder.png";
                }}
              />
            </div>
            <p className="text-black text-center font-bold">Quét mã QR để thanh toán</p>
            <p className="text-zinc-700 text-sm text-center mt-2">
              Sử dụng ứng dụng ngân hàng của bạn để quét mã và chuyển khoản.
            </p>
          </div>

          {/* Right Column: Payment Info */}
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Thông tin thanh toán</h3>
              <div className="space-y-2 text-white">
                <p><span className="text-zinc-400">Số tiền:</span> {totalAmount.toLocaleString()}đ</p>
                <p><span className="text-zinc-400">Người mua:</span> {userInfo.fullName}</p>
                <p><span className="text-zinc-400">Email:</span> {userInfo.email}</p>
                <p><span className="text-zinc-400">Số điện thoại:</span> {userInfo.phone}</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Chi tiết vé</h3>
              <div className="space-y-2">
                {selectedTickets.filter(t => t.quantity > 0).map(ticket => (
                  <div key={ticket.id} className="text-white">
                    <p>{ticket.name} x{ticket.quantity}</p>
                    <p className="text-zinc-400">{ticket.price.toLocaleString()}đ/vé</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New: Process Payment Button - TEMPORARILY HIDDEN */}
            {false && !emailSent && !isCheckingPayment && (
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Xác nhận thanh toán</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Nhấn nút bên dưới để xác nhận thanh toán và gửi email vé điện tử
                </p>
                <button
                  onClick={processPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang xử lý thanh toán...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Xác nhận thanh toán</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Auto Payment Status */}
            {!emailSent && !isCheckingPayment && (
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Trạng thái thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white">Chờ thanh toán tự động</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm">Mã đơn hàng:</p>
                    <p className="text-white font-mono">{orderNumber}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm">Số tiền:</p>
                    <p className="text-white font-bold">{totalAmount.toLocaleString()}đ</p>
                  </div>
                  
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">
                      💡 <strong>Hướng dẫn:</strong> Quét mã QR và chuyển khoản. Email vé sẽ được gửi tự động khi thanh toán thành công.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Checking Status */}
            {isCheckingPayment && (
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">Đang kiểm tra thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white">Đang chờ xác nhận thanh toán...</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm">Thời gian còn lại:</p>
                    <p className="text-2xl font-bold text-white">{formatTime(paymentCheckCountdown)}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-zinc-400 text-sm">Mã đơn hàng:</p>
                    <p className="text-white font-mono">{purchaseData?.orderNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Check Result */}
            {!isCheckingPayment && paymentCheckResult !== 'pending' && (
              <div className={`rounded-lg p-4 ${
                paymentCheckResult === 'success' 
                  ? 'bg-green-900/30 border border-green-500/30' 
                  : 'bg-red-900/30 border border-red-500/30'
              }`}>
                <div className="flex items-center space-x-3">
                  {paymentCheckResult === 'success' ? (
                    <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <div>
                    <h3 className={`text-lg font-bold ${
                      paymentCheckResult === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {paymentCheckResult === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                    </h3>
                    <p className={`text-sm ${
                      paymentCheckResult === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {paymentCheckResult === 'success' 
                        ? 'Email vé điện tử đã được gửi tới ' + userInfo.email
                        : 'Không nhận được xác nhận thanh toán. Vui lòng thử lại.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 