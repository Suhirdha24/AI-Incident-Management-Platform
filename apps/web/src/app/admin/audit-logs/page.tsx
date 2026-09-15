'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { History, ShieldCheck, Lock } from 'lucide-react';
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Immutable Audit Trail</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Cryptographically hashed immutable audit history recording every incident, AI analysis, status change, and user action.
        </p>
      </div>

      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-semibold bg-slate-50/50 dark:bg-slate-950/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Resource ID</th>
                <th className="py-3 px-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {logs.map(log => (
                <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {log.userName || 'System'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{log.resourceType}</td>
                  <td className="py-3.5 px-4 text-sky-400 font-bold">{log.resourceId}</td>
                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">
                    {JSON.stringify(log.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
