# 📝 TODO List – Xây dựng CRM Admin (Frontend)

## 1. Khởi tạo dự án & cấu hình cơ bản
- [x] Khởi tạo project Next.js (TypeScript)
- [x] Cài đặt Tailwind CSS, cấu hình theme
- [x] Tích hợp template TailAdmin (import layout, sidebar, header)
- [x] Thiết lập cấu trúc thư mục chuẩn (components, modules, mocks, utils, ...)

## 2. Xây dựng hệ thống xác thực (Auth)
- [ ] Tích hợp Supabase Auth hoặc backend JWT
- [ ] Trang đăng nhập (login)
- [ ] Lưu token, thông tin user, roles, organizations
- [ ] Middleware kiểm tra đăng nhập, redirect nếu chưa login
- [ ] Hiển thị thông tin user, vai trò, tổ chức hiện tại trên header
- [ ] Dropdown chuyển đổi organization (nếu user thuộc nhiều tổ chức)

## 3. Dashboard (Tổng quan)
- [ ] Trang dashboard: thống kê tổng quan (mock data)
- [ ] Biểu đồ doanh thu, số vé bán, số sự kiện (dùng chart mock)

## 4. Module Tổ chức (Organizations)
- [ ] Trang danh sách tổ chức (table, filter)
- [ ] Form tạo/sửa tổ chức (modal/drawer)
- [ ] Xoá tổ chức (confirm dialog)
- [ ] Upload logo tổ chức (mock)

## 5. Module Người dùng (Users)
- [ ] Trang danh sách user (table, filter, phân trang)
- [ ] Thêm user (form, gán vai trò, mời qua email - mock)
- [ ] Sửa/xoá user
- [ ] Hiển thị trạng thái, vai trò user

## 6. Module Sự kiện (Events)
- [ ] Trang danh sách sự kiện (table, filter theo tổ chức)
- [ ] Tạo/sửa/xoá sự kiện (form, upload banner)
- [ ] Hiển thị số vé đã bán, trạng thái sự kiện

## 7. Module Loại vé (Tickets)
- [ ] Trang danh sách loại vé theo sự kiện
- [ ] Tạo/sửa/xoá loại vé (form)
- [ ] Hiển thị giá, số lượng, trạng thái vé

## 8. Module Đơn hàng (Orders)
- [ ] Trang danh sách đơn hàng (table, filter, phân trang)
- [ ] Xem chi tiết đơn hàng (modal/drawer, mock data)
- [ ] Hiển thị trạng thái, tổng tiền, user mua, sự kiện

## 9. Module Check-in
- [ ] Trang danh sách check-in (table, filter)
- [ ] Quét mã QR (mock UI, chưa cần tích hợp thật)
- [ ] Hiển thị trạng thái, thời gian check-in

## 10. Cài đặt tài khoản
- [ ] Trang thông tin cá nhân
- [ ] Đổi mật khẩu
- [ ] Đăng xuất

## 11. Data mẫu & State
- [ ] Tạo file JSON data mẫu cho từng module (organizations, users, events, tickets, orders, checkin)
- [ ] Kết nối CRUD UI với data mẫu (local state hoặc localStorage)

## 12. Phân quyền UI
- [ ] Ẩn/hiện chức năng theo vai trò (admin, staff, viewer)
- [ ] Middleware kiểm tra quyền khi truy cập trang

## 13. UI/UX & Responsive
- [ ] Responsive cho mobile/tablet
- [ ] Loading, empty state, error state cho các bảng dữ liệu
- [ ] Toast/thông báo khi thao tác thành công/thất bại

## 14. Chuẩn bị tích hợp API thật
- [ ] Tách API client, chuẩn bị hook gọi API cho từng module
- [ ] Định nghĩa interface/type cho data thực tế
- [ ] Đánh dấu các nơi cần thay thế mock data bằng API

---
**Ghi chú:**
- Ưu tiên hoàn thiện UI/UX với data mẫu, sau đó tích hợp API thật khi backend sẵn sàng.
- Có thể bổ sung dashboard nâng cao, quản lý webhook, cấu hình payment, ... về sau. 