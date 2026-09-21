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
  Layers,
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
    <aside className="w-56 border-r border-neutral-200 dark:border-neutral-800/80 bg-warm-50 dark:bg-dark-surface flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors">
      <div>
        {/* Brand Header */}
        <Link href="/dashboard" className="p-4 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center space-x-2.5 group">
          <div className="w-7 h-7 rounded bg-terracotta-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                OpsAI
              </span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                v2.8
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">Incident Intelligence</p>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="px-2.5 py-4 space-y-5 text-xs">
          <div>
            <div className="px-2 mb-2 text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Operations Console
            </div>
            <nav className="space-y-0.5">
              {navItems.map(item => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-2.5 py-2 rounded-md transition-all font-medium ${
                      isActive
                        ? 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-l-2 border-terracotta-500'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-terracotta-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Admin Tools */}
          <div>
            <div className="px-2 mb-2 text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
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
                    className={`flex items-center px-2.5 py-2 rounded-md transition-all font-medium ${
                      isActive
                        ? 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-l-2 border-terracotta-500'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2.5 ${isActive ? 'text-terracotta-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800/80 space-y-2 text-xs">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className="flex items-center">
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 mr-2 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 mr-2 text-neutral-600" />
            )}
            {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </span>
        </button>

        {user && (
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-between px-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 object-cover shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.name ? user.name.split(' ')[0] : 'User'}</p>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
