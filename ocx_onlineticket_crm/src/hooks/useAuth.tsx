"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/apiConfig';

interface User {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { access_token: string; refresh_token: string; user: User }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data from /auth/me API
  const fetchUserData = async (accessToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      if (storedToken) {
        setToken(storedToken);
        
        // Fetch fresh user data from API
        const userData = await fetchUserData(storedToken);
        if (userData) {
          setUser(userData);
          // Update stored user data
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else {
          // If API call fails, clear auth data
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: { access_token: string; refresh_token: string; user: User }) => {
    setToken(data.access_token);
    
    // Fetch fresh user data from API
    const userData = await fetchUserData(data.access_token);
    const finalUser = userData || data.user;
    
    setUser(finalUser);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(finalUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/signin'; // Force reload and redirect
    }
  };

  const refreshUser = async () => {
    if (token) {
      const userData = await fetchUserData(token);
      if (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 