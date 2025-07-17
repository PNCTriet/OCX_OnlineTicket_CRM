# Supabase OAuth Setup Guide

## Flow hoạt động:
1. **Frontend (port 3002):** User click "Sign in with Google"
2. **Frontend:** Gọi Supabase Auth OAuth
3. **Supabase:** Redirect đến Google OAuth
4. **Google OAuth:** User authenticate
5. **Google callback về:** Supabase Auth
6. **Supabase:** Trả về JWT token cho Frontend
7. **Frontend:** Lưu token và gọi Backend API
8. **Backend:** Tự động tạo user mapping khi nhận JWT

---

## 1. Supabase Setup

### 1.1. Tạo Supabase Project
1. Vào [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy URL và anon key từ Settings > API

### 1.2. Setup Google OAuth trong Supabase
1. Vào Authentication > Providers
2. Enable Google provider
3. Thêm Google OAuth credentials:
   - **Client ID:** Google OAuth Client ID
   - **Client Secret:** Google OAuth Client Secret
4. Thêm redirect URL: `http://localhost:3002/auth/callback`

### 1.3. Environment Variables
Thêm vào `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 2. Google OAuth Console Setup

### 2.1. Tạo OAuth Credentials
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project hoặc chọn project có sẵn
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials

### 2.2. Authorized Redirect URIs
Thêm các redirect URIs:
```
http://localhost:3002/auth/callback
https://yourdomain.com/auth/callback (production)
```

### 2.3. OAuth Scopes
Đảm bảo có các scopes:
- `email`
- `profile`
- `openid`

---

## 3. Backend JWT Verification

### 3.1. Cài đặt Supabase JWT verification
```bash
npm install @supabase/supabase-js
```

### 3.2. JWT Verification Middleware
Tạo file `src/middleware/jwt-verification.middleware.ts`:

```typescript
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class JwtVerificationMiddleware implements NestMiddleware {
  private supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify JWT với Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Tự động tạo user mapping nếu chưa có
      await this.createUserMapping(user);
      
      // Thêm user vào request
      req['user'] = user;
      
      next();
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private async createUserMapping(supabaseUser: any) {
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await this.prisma.user.findFirst({
      where: { supabase_id: supabaseUser.id }
    });

    if (!existingUser) {
      // Tạo user mapping mới
      await this.prisma.user.create({
        data: {
          supabase_id: supabaseUser.id,
          email: supabaseUser.email,
          first_name: supabaseUser.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          role: 'USER'
        }
      });
    }
  }
}
```

### 3.3. Cập nhật App Module
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtVerificationMiddleware } from './middleware/jwt-verification.middleware';

@Module({
  // ... existing imports
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtVerificationMiddleware)
      .forRoutes('*'); // Áp dụng cho tất cả routes
  }
}
```

---

## 4. Frontend Implementation

### 4.1. Cài đặt Supabase
```bash
npm install @supabase/supabase-js
```

### 4.2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4.3. Auth Hook Update
Cập nhật `useAuth` hook để hỗ trợ Supabase:

```typescript
// hooks/useAuth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useAuth = () => {
  // ... existing code

  const login = (authData: any) => {
    // Lưu Supabase session
    setUser(authData.user);
    setIsAuthenticated(true);
    
    // Lưu tokens
    localStorage.setItem('access_token', authData.access_token);
    localStorage.setItem('refresh_token', authData.refresh_token);
  };

  const logout = async () => {
    // Sign out từ Supabase
    await supabase.auth.signOut();
    
    // Clear local state
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return { user, isAuthenticated, login, logout };
};
```

---

## 5. API Calls với JWT

### 5.1. API Config Update
Cập nhật `lib/apiConfig.ts`:

```typescript
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const apiCall = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired, try refresh
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (!error && data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        
        // Retry request
        return fetch(url, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        });
      }
    }
    
    // Redirect to login
    window.location.href = '/signin';
  }

  return response;
};
```

---

## 6. Testing Flow

### 6.1. Test Google OAuth
1. Click "Sign in with Google"
2. Verify redirect đến Google OAuth
3. Complete authentication
4. Verify callback về frontend
5. Check token được lưu
6. Verify redirect đến dashboard

### 6.2. Test Backend API
1. Gọi API với JWT token
2. Verify backend nhận và verify token
3. Verify user mapping được tạo
4. Test API responses

---

## 7. Production Setup

### 7.1. Environment Variables
```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 7.2. Google OAuth
- Update redirect URIs cho production domain
- Verify OAuth consent screen
- Test production flow

---

## Lưu ý quan trọng

1. **Security:** Service role key chỉ dùng ở backend, không expose ra frontend
2. **JWT Expiry:** Handle token refresh tự động
3. **Error Handling:** Proper error handling cho OAuth failures
4. **User Mapping:** Backend tự động tạo user mapping khi nhận JWT
5. **Session Management:** Supabase handle session, frontend chỉ lưu tokens

---

**🎯 Flow hoàn chỉnh đã sẵn sàng!** 