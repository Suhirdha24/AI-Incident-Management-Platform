'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Sun, Moon, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export function Topbar() {
  const pathname = usePathname();
  const { user, theme, toggleTheme } = useAuth();
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
    return 'PulseOps Console';
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
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <span>PulseOps AI</span>
          <span>/</span>
          <span className="capitalize">{pathname.split('/')[1] || 'Dashboard'}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, services, alerts..."
            className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Live Notifications</span>
                <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded font-semibold">
                  3 Unread
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start space-x-2.5">
                    {n.type === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                    {n.type === 'ai' && <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{n.message}</p>
                      <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline-block">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
