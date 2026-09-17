'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sun, Moon, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Operations Overview';
    if (pathname === '/incidents') return 'Incident Console';
    if (pathname.startsWith('/incidents/')) return 'Incident Details';
    if (pathname === '/alerts') return 'Alert Intelligence';
    if (pathname === '/services') return 'Service Catalog';
    if (pathname === '/analytics') return 'SRE & Reliability Analytics';
    if (pathname === '/postmortems') return 'AI Incident Postmortems';
    if (pathname === '/admin/users') return 'User & RBAC Management';
    if (pathname === '/admin/alert-sources') return 'Monitoring Sources';
    if (pathname === '/admin/audit-logs') return 'System Audit Logs';
    return 'IncidentPulse Console';
  };

  const notifications = [
    {
      id: '1',
      title: 'SEV-1 Incident Detected',
      message: 'Payment API error rate breached threshold (18.7%)',
      time: '32m ago',
      type: 'critical'
    },
    {
      id: '2',
      title: 'AI Analysis Complete',
      message: 'Probable cause identified for INC-2026-0192 (87% confidence)',
      time: '29m ago',
      type: 'ai'
    },
    {
      id: '3',
      title: 'Engineer Assigned',
      message: 'Vishal assigned to lead investigation',
      time: '25m ago',
      type: 'info'
    }
  ];

  return (
    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] text-zinc-500 font-mono">
          <span>IncidentPulse AI</span>
          <span>/</span>
          <span className="capitalize">{pathname.split('/')[1] || 'Dashboard'}</span>
        </div>
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, services, alerts..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500"
          />
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Live Signals</span>
                <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                  3 Unread
                </span>
              </div>
              <div className="space-y-1.5">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors flex items-start space-x-2.5">
                    {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                    {n.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{n.title}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{n.message}</p>
                      <span className="text-[9px] text-zinc-400 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 object-cover"
            />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hidden sm:inline-block">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

