import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Check if RESEND_API_KEY is available
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not configured');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, ticketData } = await request.json();

    console.log('Email request:', { to, subject, hasTicketData: !!ticketData });

    // Validate required fields
    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to, subject, hasHtml: !!html });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Nếu có ticketData, tạo PDF và gửi với attachment
    if (ticketData) {
      console.log('Generating PDF for ticket data:', ticketData.orderId);
      
      try {
        // Tạo PDF từ ticket data
        const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-ticket-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });

        if (!pdfResponse.ok) {
          const errorText = await pdfResponse.text();
          console.error('PDF generation failed:', pdfResponse.status, errorText);
          throw new Error(`Failed to generate PDF: ${pdfResponse.status} ${errorText}`);
        }

        const pdfBuffer = await pdfResponse.arrayBuffer();
        console.log('PDF generated successfully, size:', pdfBuffer.byteLength);

        // Gửi email với PDF attachment
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM || 'Ớt Cay Xè <noreply@otcayxe.com>',
          to: [to],
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🎫 Vé Điện Tử</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0;">Ớt Cay Xè Studio</p>
              </div>
              
              <div style="margin-bottom: 25px;">
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Xin chào ${ticketData.user.firstName} ${ticketData.user.lastName}!</h2>
                <p style="color: #374151; line-height: 1.6; margin: 0;">
                  Cảm ơn bạn đã đặt vé cho sự kiện <strong>${ticketData.eventTitle}</strong>.
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
          `,
          attachments: [
            {
              filename: `ve_${ticketData.orderId}.pdf`,
              content: Buffer.from(pdfBuffer),
            },
          ],
        });

        if (error) {
          console.error('Resend error with PDF:', error);
          return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 });
        }

        console.log('Email sent successfully with PDF');
        return NextResponse.json({ success: true, data });
             } catch (pdfError: any) {
         console.error('PDF generation or email sending error:', pdfError);
         return NextResponse.json({ error: `PDF/Email error: ${pdfError.message || 'Unknown error'}` }, { status: 500 });
       }
    } else {
      // Gửi email thông thường (cho bulk email)
      console.log('Sending regular email to:', to);
      
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM || 'Ớt Cay Xè <noreply@otcayxe.com>',
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error('Resend error for regular email:', error);
        return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 });
      }

      console.log('Regular email sent successfully');
      return NextResponse.json({ success: true, data });
    }
      } catch (error: any) {
      console.error('Email API error:', error);
      return NextResponse.json({ error: `Failed to send email: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
} 