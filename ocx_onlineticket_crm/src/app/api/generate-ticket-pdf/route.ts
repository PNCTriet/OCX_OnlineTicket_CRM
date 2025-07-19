import { NextRequest, NextResponse } from 'next/server';

interface TicketData {
  orderId: string;
  eventTitle: string;
  organizationName: string;
  totalAmount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  orderItems: Array<{
    ticketName: string;
    quantity: number;
    price: number;
    code?: string;
    qrCode?: string;
    qrCodeImage?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const ticketData: TicketData = await request.json();
    
    console.log('PDF generation started for order:', ticketData.orderId);
    
    // Create a simple HTML content for PDF
    const htmlContent = `
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
          ${ticketData.orderItems.map(item => `
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

    // For now, return HTML content instead of PDF
    // This is a temporary solution until we fix the PDF generation
    console.log('HTML content generated successfully');

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="ve_${ticketData.orderId}.html"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: `Failed to generate PDF: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 