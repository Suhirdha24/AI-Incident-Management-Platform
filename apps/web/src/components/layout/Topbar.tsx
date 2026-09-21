'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, ShieldCheck, Activity, AlertTriangle, Cpu } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Operations Overview';
    if (pathname === '/incidents') return 'Incidents Directory';
    if (pathname.startsWith('/incidents/')) return 'Incident Workspace';
    if (pathname === '/alerts') return 'Alert Intelligence';
    if (pathname === '/services') return 'Service Catalog';
    if (pathname === '/analytics') return 'SRE Reliability Analytics';
    if (pathname === '/postmortems') return 'Incident Postmortems';
    if (pathname === '/admin/users') return 'User & Access Management';
    if (pathname === '/admin/alert-sources') return 'Telemetry Alert Sources';
    if (pathname === '/admin/audit-logs') return 'System Audit Trail';
    return 'OpsAI Console';
  };

  const notifications = [
    {
      id: '1',
      title: 'SEV-1 Critical Incident Detected',
      message: 'Payment API error rate surged to 18.7%',
      time: '32m ago',
      type: 'critical'
    },
    {
      id: '2',
      title: 'AI Root Cause Diagnosis Ready',
      message: 'DB connection pool exhaustion identified (87% confidence)',
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
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800/80 bg-warm-50/90 dark:bg-dark-surface/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 font-mono">
          <span>OpsAI</span>
          <span>/</span>
          <span className="capitalize">{pathname.split('/')[1] || 'Dashboard'}</span>
        </div>
        <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative w-64 hidden md:block text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search incidents, services, alerts..."
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-terracotta-500 placeholder:text-neutral-400 transition-colors"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-terracotta-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Live Operational Signals</span>
                <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                  3 Unread
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                {notifications.map(n => (
                  <div key={n.id} className="p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-start space-x-2.5">
                    {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />}
                    {n.type === 'ai' && <Cpu className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{n.title}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-neutral-400 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        {user && (
          <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 object-cover"
            />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden sm:inline-block">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
