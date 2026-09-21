'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 max-w-md w-full space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Resource Not Found
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            The page or incident record you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Link
            href="/incidents"
            className="px-3.5 py-2 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Incidents Directory</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
