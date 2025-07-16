# 📝 TODO List – Xây dựng CRM Admin (Frontend)

## 1. Khởi tạo dự án & cấu hình cơ bản
- [x] Khởi tạo project Next.js (TypeScript)
- [x] Cài đặt Tailwind CSS, cấu hình theme
- [x] Thiết lập cấu trúc thư mục chuẩn (components, modules, mocks, utils, ...)
- [x] Tích hợp template TailAdmin (import layout, sidebar, header) - **ĐÃ HOÀN THÀNH**

## 2. Xây dựng hệ thống xác thực (Auth)
- [x] Trang đăng nhập (login) - **ĐÃ HOÀN THÀNH**
- [x] Tích hợp Supabase Auth hoặc backend JWT
- [x] Lưu token, thông tin user, roles, organizations
- [x] Middleware kiểm tra đăng nhập, redirect nếu chưa login
- [x] Hiển thị thông tin user, vai trò, tổ chức hiện tại trên header (đang làm tiếp)
- [ ] Dropdown chuyển đổi organization (nếu user thuộc nhiều tổ chức)

## 3. Dashboard (Tổng quan)
- [x] Trang dashboard: thống kê tổng quan (mock data) - **ĐÃ HOÀN THÀNH**
- [ ] Biểu đồ doanh thu, số vé bán, số sự kiện (dùng chart mock)

## 4. Module Tổ chức (Organizations)
- [x] Trang danh sách tổ chức (table, filter) - **ĐÃ CÓ TRANG /organizations, TABLE LẤY MẪU TỪ BASIC-TABLES.HTML, CALL API /organizations**
- [ ] Form tạo/sửa tổ chức (modal/drawer)
- [ ] Xoá tổ chức (confirm dialog)
- [ ] Upload logo tổ chức (mock)

## 5. Module Người dùng (Users)
- [x] Trang danh sách user (table, filter, phân trang) - **ĐÃ CÓ TRANG /users, TABLE LẤY MẪU TỪ BASIC-TABLES.HTML, CALL API /users**
- [ ] Thêm user (form, gán vai trò, mời qua email - mock)
- [ ] Sửa/xoá user
- [ ] Hiển thị trạng thái, vai trò user

## 6. Module Sự kiện (Events)
- [x] Trang danh sách sự kiện (table, filter) - **ĐÃ CÓ TRANG /events, TABLE LẤY MẪU TỪ BASIC-TABLES.HTML, CALL API /events**
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
- [x] Tạo file JSON data mẫu cho từng module (organizations, users, events, tickets, orders, checkin) - **ĐÃ HOÀN THÀNH**
- [ ] Kết nối CRUD UI với data mẫu (local state hoặc localStorage)

## 12. Phân quyền UI
- [ ] Ẩn/hiện chức năng theo vai trò (admin, staff, viewer)
- [ ] Middleware kiểm tra quyền khi truy cập trang

## 13. UI/UX & Responsive
- [x] Dark mode toggle - **ĐÃ HOÀN THÀNH**
- [ ] Responsive cho mobile/tablet
- [ ] Loading, empty state, error state cho các bảng dữ liệu
- [ ] Toast/thông báo khi thao tác thành công/thất bại

## 14. Chuẩn bị tích hợp API thật
- [ ] Tách API client, chuẩn bị hook gọi API cho từng module
- [ ] Định nghĩa interface/type cho data thực tế
- [ ] Đánh dấu các nơi cần thay thế mock data bằng API

## 📊 TÌNH HÌNH HIỆN TẠI (Cập nhật: 2024)

### ✅ Đã hoàn thành:
- **Project setup**: Next.js 15.4.1 + TypeScript + Tailwind CSS v4
- **Trang đăng nhập**: UI hoàn chỉnh với dark mode, responsive
- **Dark mode**: Toggle button và localStorage persistence
- **Layout TailAdmin**: Sidebar, Header, DashboardLayout hoàn chỉnh
- **Dashboard**: Trang dashboard với 4 cards thống kê
- **Cấu trúc thư mục**: Đầy đủ components, types, mocks, utils, modules, hooks, lib
- **Data mẫu**: Users và Organizations JSON
- **Routing**: Redirect từ `/` đến `/dashboard`
- **Auth flow**: Đã có flow đăng nhập chuẩn, lưu token, chặn truy cập trái phép, redirect hợp lý
- **Danh sách tổ chức**: Đã có trang /organizations, table chuẩn, call API
- **Danh sách user**: Đã có trang /users, table chuẩn, call API

### 🔄 Đang thực hiện:
- Cần hoàn thiện các module CRUD (Organizations, Users, Events, Tickets, Orders, Check-in)

### ⏳ Cần làm tiếp:
- Tích hợp authentication thật
- Xây dựng các module CRUD
- Responsive design
- Loading states và error handling

---
**Ghi chú:**
- Phase 1 đã hoàn thành: Setup project + Layout TailAdmin + Dashboard cơ bản
- Đã có flow xác thực chuẩn, chặn truy cập trái phép, redirect hợp lý.
- Ưu tiên hoàn thiện UI/UX với data mẫu, sau đó tích hợp API thật khi backend sẵn sàng.
- Có thể bổ sung dashboard nâng cao, quản lý webhook, cấu hình payment, ... về sau. 