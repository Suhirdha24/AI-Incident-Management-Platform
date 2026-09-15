'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  Bell,
  Server,
  BarChart3,
  FileText,
  Users,
  Radio,
  History,
  Sun,
  Moon,
  LogOut,
  Shield,
  Activity,
  Cpu
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, theme, toggleTheme } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { label: 'Alerts', href: '/alerts', icon: Bell },
    { label: 'Services', href: '/services', icon: Server },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Postmortems', href: '/postmortems', icon: FileText }
  ];

  const adminItems = [
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Alert Sources', href: '/admin/alert-sources', icon: Radio },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: History }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-sky-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              IncidentPulse AI
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                PRO
              </span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Incident Intelligence</p>
          </div>
        </div>

        {/* Main Nav Section */}
        <div className="px-3 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Core Operations
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Administration Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Administration
            </div>
            <nav className="space-y-1">
              {adminItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <span className="flex items-center">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-3 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 mr-3 text-indigo-600" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        {user && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
