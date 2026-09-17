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
  Activity
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
    <aside className="w-60 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              IncidentPulse
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                AI
              </span>
            </span>
            <p className="text-[10px] text-zinc-500 font-mono truncate">Incident Control Plane</p>
          </div>
        </div>

        {/* Main Nav Section */}
        <div className="px-3 py-4 space-y-5">
          <div>
            <div className="px-2 mb-2 text-[10px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Core Operations
            </div>
            <nav className="space-y-0.5">
              {navItems.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-2.5 py-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Administration Section */}
          <div>
            <div className="px-2 mb-2 text-[10px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Administration
            </div>
            <nav className="space-y-0.5">
              {adminItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-2.5 py-2 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <span className="flex items-center">
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 mr-2 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 mr-2 text-zinc-600" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        {user && (
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-700 object-cover"
              />
              <div className="truncate">
                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

