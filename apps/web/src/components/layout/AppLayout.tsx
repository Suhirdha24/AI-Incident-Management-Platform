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
      <div className="min-h-screen bg-[#121212] text-neutral-100 flex flex-col items-center justify-center space-y-4 font-sans p-6 bg-tech-grid">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-terracotta-500/10 border border-terracotta-500/30 flex items-center justify-center font-mono font-bold text-terracotta-500 text-sm">
            AI
          </div>
          <span className="font-bold tracking-tight text-lg text-white font-mono">
            Ops<span className="text-terracotta-500">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2.5 text-xs font-mono text-neutral-400 bg-neutral-900/90 px-4 py-2.5 rounded border border-neutral-800 shadow-xl backdrop-blur">
          <div className="w-4 h-4 border-2 border-neutral-700 border-t-terracotta-500 rounded-full animate-spin" />
          <span>Initializing OpsAI Incident Intelligence Platform...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#121212] text-neutral-100 font-sans transition-colors">
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

