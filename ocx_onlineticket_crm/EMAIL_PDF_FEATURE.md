# Email PDF Feature - Hướng Dẫn Sử Dụng

## Tổng Quan
Tính năng gửi email với PDF attachment cho phép gửi vé điện tử dưới dạng file PDF thay vì HTML inline. PDF sẽ chứa thông tin chi tiết về vé, QR code và hướng dẫn sử dụng.

## Các Thành Phần

### 1. API Routes
- `/api/generate-qr` - Tạo QR code từ ticket code
- `/api/generate-ticket-pdf` - Tạo PDF từ ticket data
- `/api/send-email` - Gửi email với PDF attachment

### 2. Helper Functions
- `generateTicketQRCode()` - Tạo QR code từ ticket code
- `generateQRCodeSVG()` - Tạo QR code SVG
- `generateQRCodePNG()` - Tạo QR code PNG

### 3. Pages
- `/email-management` - Trang quản lý gửi email
- `/ticket-codes` - Trang xem QR code tickets

## Cách Sử Dụng

### 1. Gửi Email với PDF Attachment
1. Vào trang **Email Management**
2. Chọn tab **Orders**
3. Chọn các đơn hàng cần gửi email
4. Click **Send Tickets**
5. Hệ thống sẽ:
   - Tạo QR code từ ticket codes
   - Generate PDF với thông tin vé
   - Gửi email với PDF attachment

### 2. Xem QR Code trong Modal
1. Vào trang **Ticket Codes**
2. Click vào icon QR code
3. Modal sẽ hiển thị QR code và thông tin ticket

## Cấu Trúc PDF
PDF bao gồm:
- Header với logo và tiêu đề
- Thông tin đơn hàng (mã, sự kiện, tổ chức, khách hàng)
- Chi tiết từng vé với QR code
- Hướng dẫn sử dụng
- Footer

## Dependencies
```json
{
  "@react-pdf/renderer": "^3.4.0",
  "puppeteer-core": "^21.0.0",
  "chrome-aws-lambda": "^10.1.0",
  "qrcode.react": "^3.1.0"
}
```

## Environment Variables
```env
NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_RESEND_FROM=noreply@yourdomain.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Troubleshooting

### Lỗi thường gặp:
1. **QR code không hiển thị**: Kiểm tra ticket code có tồn tại không
2. **PDF không generate**: Kiểm tra puppeteer và chrome-aws-lambda
3. **Email không gửi được**: Kiểm tra Resend API key

### Debug:
- Xem console logs để debug
- Kiểm tra network tab để xem API calls
- Verify ticket data structure

## Security
- QR codes được generate từ ticket codes
- PDF được tạo trên server để bảo mật
- Email được gửi qua Resend với authentication 