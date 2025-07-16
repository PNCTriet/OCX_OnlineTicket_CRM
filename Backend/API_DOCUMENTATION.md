# 📚 API Documentation

Tài liệu tổng hợp tất cả các API của hệ thống (bao gồm Auth và các module khác).

---

## 1. Auth API

> Hệ thống xác thực sử dụng Supabase Auth + NestJS

---

## 1.1. Đăng ký tài khoản

### Endpoint
- **POST** `/auth/register`

### Request Body
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Response
- Nếu thành công:
```json
{
  "user": { ... },
  "message": "Please check your email to confirm registration."
}
```
- Nếu lỗi:
```json
{
  "error": "Email already registered"
}
```

### Test cURL
```sh
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

---

## 1.2. Đăng nhập

### Endpoint
- **POST** `/auth/login`

### Request Body
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### Response
- Nếu thành công:
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": { ... }
}
```
- Nếu lỗi:
```json
{
  "error": "Invalid login credentials"
}
```

### Test cURL
```sh
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

---

## 1.3. Lấy thông tin user hiện tại (yêu cầu JWT)

### Endpoint
- **GET** `/auth/me`

### Header
- `Authorization: Bearer <ACCESS_TOKEN>`

### Response
- Nếu token hợp lệ:
```json
{
  "supabaseUser": { ... }
}
```
- Nếu token không hợp lệ:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test cURL
```sh
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 1.4. Đăng xuất (yêu cầu JWT)

### Endpoint
- **POST** `/auth/logout`

### Header
- `Authorization: Bearer <ACCESS_TOKEN>`

### Response
- Nếu thành công:
```json
{
  "message": "Logged out successfully"
}
```
- Nếu lỗi:
```json
{
  "error": "Error message"
}
```

### Test cURL
```sh
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 1.5. Refresh Token

### Endpoint
- **POST** `/auth/refresh`

### Request Body
```json
{
  "refresh_token": "your_refresh_token"
}
```

### Response
- Nếu thành công:
```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",
  "user": { ... }
}
```
- Nếu lỗi:
```json
{
  "error": "Invalid refresh token"
}
```

### Test cURL
```sh
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"your_refresh_token"}'
```

---

## 1.6. Error Handling

### Các lỗi thường gặp:

#### Email đã tồn tại khi đăng ký:
```json
{
  "error": "User already registered"
}
```

#### Sai email/password khi đăng nhập:
```json
{
  "error": "Invalid login credentials"
}
```

#### Token hết hạn hoặc không hợp lệ:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Refresh token không hợp lệ:
```json
{
  "error": "Invalid refresh token"
}
```

---

## 1.7. Case test thực tế

### Đăng ký user mới
```sh
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@example.com","password":"Test@1234"}'
```

### Đăng nhập user đã đăng ký
```sh
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser1@example.com","password":"Test@1234"}'
```

### Lấy thông tin user hiện tại
```sh
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Refresh token khi access token hết hạn
```sh
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<REFRESH_TOKEN>"}'
```

### Đăng xuất
```sh
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 1.8. Lưu ý
- Password phải đủ mạnh theo yêu cầu của Supabase.
- Sau khi đăng ký, user cần xác nhận email (check email để activate tài khoản).
- Access token có thời hạn, nếu hết hạn cần dùng refresh token để lấy token mới.
- Sau khi logout, token sẽ không còn hiệu lực.

---

## 2. Users API

> CRUD user, mapping supabase_id. (Hiện tại chưa phân quyền, sẽ bổ sung ở phase sau)

### 2.1. Tạo user
- **POST** `/users`
- **Body:**
```json
{
  "supabase_id": "uuid",
  "email": "user@gmail.com",
  "first_name": "Nguyen",
  "last_name": "Van A",
  "phone": "0123456789",
  "avatar_url": "https://example.com/avatar.png"
}
```
- **Response:**
```json
{
  "id": "...",
  "supabase_id": "...",
  "email": "...",
  ...
}
```

### 2.2. Lấy danh sách user
- **GET** `/users`
- **Response:**
```json
[
  { "id": "...", "email": "...", ... },
  ...
]
```

### 2.3. Lấy chi tiết user
- **GET** `/users/:id`
- **Response:**
```json
{
  "id": "...",
  "email": "...",
  ...
}
```

### 2.4. Cập nhật user
- **PATCH** `/users/:id`
- **Body:**
```json
{
  "first_name": "Nguyen",
  "last_name": "Van B"
}
```
- **Response:**
```json
{
  "id": "...",
  "first_name": "Nguyen",
  "last_name": "Van B",
  ...
}
```

### 2.5. Xóa user
- **DELETE** `/users/:id`
- **Response:**
```json
{
  "id": "...",
  ...
}
```

---

## 3. Organizations API

> CRUD tổ chức, phân quyền sẽ bổ sung ở phase sau.

### 3.1. Tạo tổ chức
- **POST** `/organizations`
- **Body:**
```json
{
  "name": "Howls Studio",
  "description": "Tổ chức sự kiện âm nhạc",
  "contact_email": "contact@howls.studio",
  "phone": "0123456789",
  "address": "123 Đường ABC, Quận 1, TP.HCM",
  "logo_url": "https://howls.studio/logo.png",
  "website": "https://howls.studio"
}
```
- **Response:**
```json
{
  "id": "...",
  "name": "Howls Studio",
  ...
}
```

### 3.2. Lấy danh sách tổ chức
- **GET** `/organizations`
- **Response:**
```json
[
  { "id": "...", "name": "...", ... },
  ...
]
```

### 3.3. Lấy chi tiết tổ chức
- **GET** `/organizations/:id`
- **Response:**
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

### 3.4. Cập nhật tổ chức
- **PATCH** `/organizations/:id`
- **Body:**
```json
{
  "name": "Howls Studio New"
}
```
- **Response:**
```json
{
  "id": "...",
  "name": "Howls Studio New",
  ...
}
```

### 3.5. Xóa tổ chức
- **DELETE** `/organizations/:id`
- **Response:**
```json
{
  "id": "...",
  ...
}
```

---

## 4. Events API

> CRUD sự kiện. (Hiện tại chưa phân quyền, sẽ bổ sung ở phase sau)

### 4.1. Tạo sự kiện
- **POST** `/events`
- **Body:**
```json
{
  "organization_id": "org_cuid",
  "title": "Sự kiện âm nhạc Howls",
  "description": "Đêm nhạc Howls Studio",
  "location": "Nhà hát Hòa Bình",
  "start_date": "2025-08-01T19:00:00.000Z",
  "end_date": "2025-08-01T22:00:00.000Z",
  "banner_url": "https://howls.studio/banner.png",
  "status": "DRAFT"
}
```
- **Response:**
```json
{
  "id": "...",
  "organization_id": "...",
  "title": "...",
  ...
}
```

### 4.2. Lấy danh sách sự kiện
- **GET** `/events`
- **Response:**
```json
[
  { "id": "...", "title": "...", ... },
  ...
]
```

### 4.3. Lấy chi tiết sự kiện
- **GET** `/events/:id`
- **Response:**
```json
{
  "id": "...",
  "title": "...",
  ...
}
```

### 4.4. Cập nhật sự kiện
- **PATCH** `/events/:id`
- **Body:**
```json
{
  "title": "Sự kiện mới"
}
```
- **Response:**
```json
{
  "id": "...",
  "title": "Sự kiện mới",
  ...
}
```

### 4.5. Xóa sự kiện
- **DELETE** `/events/:id`
- **Response:**
```json
{
  "id": "...",
  ...
}
```

---

## 5. Tickets API

> CRUD vé sự kiện, quản lý số lượng, thời gian mở bán, trạng thái vé. (Hiện tại chưa phân quyền, sẽ bổ sung ở phase sau)

### 5.1. Tạo vé
- **POST** `/tickets`
- **Body:**
```json
{
  "event_id": "event_cuid",
  "name": "Vé VIP",
  "description": "Ghế VIP gần sân khấu",
  "price": 1000000,
  "total_qty": 100,
  "sale_start": "2025-08-01T08:00:00.000Z",
  "sale_end": "2025-08-01T20:00:00.000Z",
  "status": "ACTIVE"
}
```
- **Response:**
```json
{
  "id": "...",
  "event_id": "...",
  "name": "...",
  ...
}
```

### 5.2. Lấy danh sách vé
- **GET** `/tickets`
- **Response:**
```json
[
  { "id": "...", "name": "...", ... },
  ...
]
```

### 5.3. Lấy chi tiết vé
- **GET** `/tickets/:id`
- **Response:**
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

### 5.4. Cập nhật vé
- **PATCH** `/tickets/:id`
- **Body:**
```json
{
  "name": "Vé VIP mới"
}
```
- **Response:**
```json
{
  "id": "...",
  "name": "Vé VIP mới",
  ...
}
```

### 5.5. Xóa vé
- **DELETE** `/tickets/:id`
- **Response:**
```json
{
  "id": "...",
  ...
}
```

### 5.6. Lấy vé theo sự kiện
- **GET** `/tickets/event/:event_id`
- **Response:**
```json
[
  { "id": "...", "event_id": "...", ... },
  ...
]
```

---

## [Các module khác sẽ bổ sung tại đây] 