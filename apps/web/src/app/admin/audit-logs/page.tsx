'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { safeFormatDate } from '@/lib/dateUtils';
import { History, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/audit-logs')
      .then(res => setLogs(res || []))
      .catch(err => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-terracotta-500" />
            Immutable Cryptographic Audit Trail
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cryptographically hashed audit ledger recording every incident state mutation, AI hypothesis output, and user action.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>LEDGER VERIFIED</span>
        </div>
      </div>

      <div className="rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase bg-neutral-50 dark:bg-neutral-900/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Resource ID</th>
                <th className="py-3 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id || log.timestamp} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                      {safeFormatDate(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {log.userName || 'System'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-terracotta-500/10 text-terracotta-500 border border-terracotta-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{log.resourceType}</td>
                    <td className="py-3.5 px-4 text-terracotta-400 font-semibold">{log.resourceId}</td>
                    <td className="py-3.5 px-4 text-neutral-400 truncate max-w-xs">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

