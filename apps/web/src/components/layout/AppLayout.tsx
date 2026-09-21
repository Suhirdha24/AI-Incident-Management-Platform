'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/lib/authContext';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Standalone full-screen pages (Landing & Login)
  if (pathname === '/login' || pathname === '/') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 dark:bg-dark-bg flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-7 h-7 border-2 border-neutral-300 dark:border-neutral-700 border-t-terracotta-500 rounded-full animate-spin" />
        <p className="text-xs font-mono text-neutral-500">Initializing OpsAI Intelligence Platform...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-warm-50 dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 font-sans transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
