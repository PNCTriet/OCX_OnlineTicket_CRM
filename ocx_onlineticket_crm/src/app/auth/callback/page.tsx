"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Lấy session từ Supabase Auth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth error:', error);
          router.push('/signin?error=auth_failed');
          return;
        }

        if (session) {
          // Lưu JWT token từ Supabase
          const accessToken = session.access_token;
          const refreshToken = session.refresh_token;
          
          // Lưu token vào localStorage để gọi Backend API
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Lưu user data vào auth context
          login({ 
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              role: 'USER'
            }
          });
          
          // Backend sẽ tự động tạo user mapping khi nhận JWT
          // Redirect đến dashboard
          router.push('/dashboard');
        } else {
          // Không có session, redirect về signin
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/signin?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Processing authentication...</p>
      </div>
    </div>
  );
} 