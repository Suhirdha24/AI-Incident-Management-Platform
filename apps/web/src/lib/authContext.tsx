'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchApi } from './api';
import { UserRole } from '@opsai/shared';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  theme: 'dark' | 'light';
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Theme initialization
    const savedTheme = (localStorage.getItem('opsai_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Token & Auth check
    const savedToken = localStorage.getItem('opsai_token');
    if (savedToken) {
      setToken(savedToken);
      fetchApi('/auth/me')
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('opsai_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, user, pathname, router]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('opsai_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = async (email: string, pass: string) => {
    const data = await fetchApi<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    localStorage.setItem('opsai_token', data.token);
    setToken(data.token);
    setUser(data.user);
    router.push('/dashboard');
  };

  const demoLogin = async (role: UserRole) => {
    const data = await fetchApi<{ token: string; user: User }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    });
    localStorage.setItem('opsai_token', data.token);
    setToken(data.token);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = () => {
    fetchApi('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('opsai_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, theme, login, demoLogin, logout, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
