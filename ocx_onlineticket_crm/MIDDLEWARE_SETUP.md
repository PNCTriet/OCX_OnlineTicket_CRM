# 🔐 Middleware Authentication Setup

## Tổng quan

Middleware đã được cấu hình để bảo vệ tất cả các trang cần authentication và tự động redirect về trang signin nếu chưa đăng nhập.

## 📁 Files đã cập nhật

### 1. `src/middleware.ts`
- **Chức năng:** Kiểm tra authentication cho tất cả routes
- **Protected Routes:** `/dashboard`, `/users`, `/organizations`, `/events`, `/tickets`, `/orders`, `/payments`, `/email-management`, `/ticket-codes`, `/charts`
- **Public Routes:** `/signin`, `/signup`, `/auth`, `/api`, `/testflight-buy-ticket`

### 2. `src/hooks/useAuth.tsx`
- **Cập nhật:** Lưu token vào cookies để middleware có thể đọc
- **Thêm:** `document.cookie` khi login/logout

### 3. `src/app/signin/page.tsx`
- **Cập nhật:** Xử lý redirect parameter sau khi đăng nhập
- **Loại bỏ:** Kiểm tra `isAuthenticated` (middleware xử lý)

### 4. `src/app/dashboard/page.tsx`
- **Loại bỏ:** Kiểm tra authentication (middleware xử lý)

### 5. `src/app/charts/page.tsx`
- **Loại bỏ:** Kiểm tra authentication (middleware xử lý)

### 6. `src/components/layout/Header.tsx`
- **Cập nhật:** Sử dụng `user` thay vì `isAuthenticated`

## 🔄 Flow hoạt động

### Khi truy cập protected route:
1. **Middleware kiểm tra** → Token trong cookies
2. **Nếu không có token** → Redirect về `/signin?redirect=/original-path`
3. **Nếu có token** → Cho phép truy cập

### Khi đăng nhập:
1. **User nhập credentials** → Call API login
2. **Lưu token** → localStorage + cookies
3. **Redirect** → Trang gốc hoặc dashboard

### Khi logout:
1. **Xóa token** → localStorage + cookies
2. **Redirect** → `/signin`

## 🧪 Test Cases

### ✅ Public Pages (không cần login):
- `/signin` - Trang đăng nhập
- `/signup` - Trang đăng ký  
- `/testflight-buy-ticket` - Trang test public
- `/api/*` - API routes

### 🔒 Protected Pages (cần login):
- `/dashboard` - Dashboard chính
- `/users` - Quản lý users
- `/organizations` - Quản lý tổ chức
- `/events` - Quản lý sự kiện
- `/tickets` - Quản lý vé
- `/orders` - Quản lý đơn hàng
- `/payments` - Quản lý thanh toán
- `/email-management` - Quản lý email
- `/ticket-codes` - Quản lý mã vé
- `/charts` - Biểu đồ

## 🚀 Cách test

### 1. Test Public Pages:
```bash
# Truy cập không cần login
curl http://localhost:3000/signin
curl http://localhost:3000/testflight-buy-ticket
```

### 2. Test Protected Pages:
```bash
# Truy cập sẽ redirect về signin
curl http://localhost:3000/dashboard
curl http://localhost:3000/users
```

### 3. Test Login Flow:
1. Truy cập `/dashboard` → Redirect về `/signin?redirect=/dashboard`
2. Đăng nhập → Redirect về `/dashboard`
3. Logout → Redirect về `/signin`

## ⚙️ Cấu hình

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Cookie Settings:
- **Name:** `access_token`
- **Path:** `/`
- **Max Age:** 86400 (24 giờ)
- **Secure:** true (HTTPS only)
- **SameSite:** strict

## 🔧 Troubleshooting

### Vấn đề thường gặp:

1. **Middleware không hoạt động:**
   - Kiểm tra file `src/middleware.ts` tồn tại
   - Restart development server

2. **Token không được lưu:**
   - Kiểm tra console errors
   - Kiểm tra localStorage và cookies

3. **Redirect loop:**
   - Kiểm tra logic trong middleware
   - Kiểm tra token format

### Debug Commands:
```bash
# Kiểm tra cookies
document.cookie

# Kiểm tra localStorage
localStorage.getItem('access_token')

# Kiểm tra middleware logs
# Xem console của development server
```

## 📝 Notes

- Middleware chạy trên server-side nên không thể truy cập localStorage
- Token được lưu trong cookies để middleware có thể đọc
- Tất cả protected routes đều được bảo vệ tự động
- Public routes không bị ảnh hưởng bởi middleware 