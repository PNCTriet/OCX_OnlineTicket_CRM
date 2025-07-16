# 🖥️ Đặc tả Giao diện Admin CRM – OCX Online Ticket

## 1. Tổng quan
- Giao diện quản trị (admin) xây dựng dựa trên template **TailAdmin** (Tailwind CSS).
- Hỗ trợ quản lý đa tổ chức (multi-tenant): mỗi user có thể thuộc nhiều tổ chức, chuyển đổi context tổ chức dễ dàng.
- Các module chính: Quản lý tổ chức, người dùng, sự kiện, loại vé, đơn hàng, check-in, dashboard thống kê.
- Giai đoạn đầu: CRUD sử dụng data mẫu (JSON mock), riêng Auth tích hợp API thật.

## 2. Sơ đồ menu/sidebar

```
Sidebar
├── Dashboard (Tổng quan)
├── Tổ chức (Organizations)
├── Người dùng (Users)
├── Sự kiện (Events)
├── Loại vé (Tickets)
├── Đơn hàng (Orders)
├── Check-in (Checkin)
└── Cài đặt tài khoản (Account Settings)
```

- **Chuyển tổ chức**: Dropdown chọn organization ở header/sidebar (nếu user thuộc nhiều tổ chức).
- **Hiển thị vai trò**: Góc trên phải hiển thị tên user, vai trò, tổ chức hiện tại.

## 3. Trang chính cho từng module

### 3.1 Dashboard
- Thống kê tổng quan: số sự kiện, số vé đã bán, doanh thu, số user, số đơn hàng, v.v.
- Biểu đồ (dùng chart mock data): doanh thu theo thời gian, số vé bán theo sự kiện.

### 3.2 Tổ chức (Organizations)
- Danh sách tổ chức user thuộc về (nếu là admin có thể tạo/sửa/xoá tổ chức).
- Form tạo/sửa tổ chức: tên, mô tả, logo.

### 3.3 Người dùng (Users)
- Danh sách user trong tổ chức hiện tại: tên, email, vai trò, trạng thái.
- CRUD user (chỉ admin): thêm, sửa, xoá, gán vai trò.
- Mời user qua email (mock action).

### 3.4 Sự kiện (Events)
- Danh sách sự kiện theo tổ chức: tên, ngày, trạng thái, số vé đã bán.
- CRUD sự kiện: tạo, sửa, xoá, upload banner.

### 3.5 Loại vé (Tickets)
- Danh sách loại vé theo sự kiện: tên vé, giá, số lượng, trạng thái.
- CRUD loại vé: tạo, sửa, xoá.

### 3.6 Đơn hàng (Orders)
- Danh sách đơn hàng: mã đơn, user mua, sự kiện, trạng thái, tổng tiền.
- Xem chi tiết đơn hàng (mock data).

### 3.7 Check-in
- Danh sách check-in: user, sự kiện, thời gian, trạng thái.
- Quét mã QR (mock UI, chưa cần tích hợp thật).

### 3.8 Cài đặt tài khoản
- Thông tin cá nhân, đổi mật khẩu, đăng xuất.

## 4. Ghi chú về data mẫu & Auth
- **CRUD các module**: sử dụng JSON data mẫu, lưu state trên client (local state hoặc localStorage).
- **Auth**: tích hợp API thật (Supabase Auth hoặc backend JWT), sau khi login sẽ lấy được thông tin user, vai trò, danh sách tổ chức.
- **Phân quyền UI**: ẩn/hiện chức năng theo vai trò (admin, staff, viewer).

## 5. Tham khảo cấu trúc thư mục frontend (Next.js)

```
src/
├── components/         // UI components (table, form, modal, ...)
├── modules/
│   ├── organizations/
│   ├── users/
│   ├── events/
│   ├── tickets/
│   ├── orders/
│   └── checkin/
├── pages/              // Next.js pages (route)
├── mocks/              // JSON data mẫu
├── utils/              // Helper, API client
└── styles/             // Tailwind config, custom CSS
```

---
**Lưu ý:**
- Ưu tiên hoàn thiện UI/UX trước, khi backend sẵn sàng sẽ tích hợp API cho từng module.
- Có thể mở rộng thêm dashboard thống kê, quản lý webhook, cấu hình payment, ... về sau. 