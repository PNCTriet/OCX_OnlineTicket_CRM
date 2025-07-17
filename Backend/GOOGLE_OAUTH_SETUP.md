# Google OAuth Setup for Backend

## 1. Cài đặt dependencies

```bash
npm install @nestjs/passport passport passport-google-oauth20
npm install --save-dev @types/passport-google-oauth20
```

## 2. Tạo Google OAuth Strategy

Tạo file `src/auth/google.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
```

## 3. Tạo Auth Controller cho Google OAuth

Tạo file `src/auth/auth.controller.ts`:

```typescript
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google OAuth sẽ tự động redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    
    // Tạo JWT token từ Google user data
    const token = await this.authService.createTokenFromGoogle(user);
    
    // Redirect về frontend với token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}
```

## 4. Cập nhật Auth Module

```typescript
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
```

## 5. Environment Variables

Thêm vào `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:3001
```

## 6. Setup Google OAuth Console

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)

## 7. Frontend Callback Handler

Tạo file `src/app/auth/callback/page.tsx`:

```typescript
"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      router.push('/signin?error=' + error);
      return;
    }

    if (token) {
      // Lưu token và redirect
      login({ access_token: token });
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  }, [searchParams, router, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
```

## 8. Test Flow

1. User click "Sign in with Google"
2. Redirect đến `/auth/google`
3. Google OAuth flow
4. Callback về `/auth/google/callback`
5. Tạo JWT token
6. Redirect về frontend `/auth/callback?token=xxx`
7. Frontend lưu token và redirect đến dashboard

## Lưu ý

- Đảm bảo CORS được cấu hình đúng
- Xử lý error cases (user deny, network error, etc.)
- Implement proper session management
- Consider rate limiting cho OAuth endpoints 