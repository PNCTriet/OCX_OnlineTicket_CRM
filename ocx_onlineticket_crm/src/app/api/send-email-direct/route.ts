import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, ticketData } = await request.json();

    console.log('Email request:', { to, subject, hasTicketData: !!ticketData });

    // Validate required fields
    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to, subject, hasHtml: !!html });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare email body
    const emailBody: any = {
      from: process.env.RESEND_FROM || 'Ớt Cay Xè <noreply@otcayxe.com>',
      to: [to],
      subject: subject,
      html: html,
    };

    // Add PDF attachment if ticketData is provided
    if (ticketData) {
      try {
        console.log('Generating PDF for attachment...');
        const pdfBytes = await generateTicketPDF(ticketData);
        console.log('PDF generated, size:', pdfBytes.length);
        
        const base64Content = Buffer.from(pdfBytes).toString('base64');
        console.log('Base64 content length:', base64Content.length);
        
        emailBody.attachments = [
          {
            filename: `ve_${ticketData.orderId}.pdf`,
            content: base64Content,
          },
        ];
        console.log('PDF attachment added successfully');
      } catch (attachmentError) {
        console.error('Error creating PDF attachment:', attachmentError);
        // Continue without attachment if there's an error
        console.log('Continuing without attachment...');
      }
    }

    // Initialize Resend and send email
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(emailBody);

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: `Failed to send email: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

// Helper function to generate PDF content for ticket using Puppeteer
async function generateTicketPDF(ticketData: any): Promise<Uint8Array> {
  // Generate HTML content
  const htmlContent = generateTicketHTML(ticketData);
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return pdf;
  } finally {
    await browser.close();
  }
}

// Helper function to generate HTML content for ticket
function generateTicketHTML(ticketData: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Vé Điện Tử - ${ticketData.eventTitle}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
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
          font-weight: bold;
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