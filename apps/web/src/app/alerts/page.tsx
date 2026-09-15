'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { AlertTriangle, Bell, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const res = await fetchApi('/alerts');
      setAlerts(res || []);
    } catch (err) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleUpdateStatus = async (alertId: string, status: string) => {
    try {
      await fetchApi(`/alerts/${alertId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      toast.success(`Alert marked as ${status}`);
      loadAlerts();
    } catch (err: any) {
      toast.error('Failed to update alert');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Alert Intelligence</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time telemetry metric threshold alerts correlated into production incident groups.
        </p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE ALERTS</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{alerts.filter(a => a.status === 'TRIGGERED').length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CRITICAL SEVERITY</span>
          <p className="text-2xl font-black text-red-500 mt-1">{alerts.filter(a => a.severity === 'CRITICAL').length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACKNOWLEDGED</span>
          <p className="text-2xl font-black text-sky-400 mt-1">{alerts.filter(a => a.status === 'ACKNOWLEDGED').length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RESOLVED</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">{alerts.filter(a => a.status === 'RESOLVED').length}</p>
        </div>
      </div>

      {/* ALERTS TABLE */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-semibold bg-slate-50/50 dark:bg-slate-950/50">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Metric & Breach</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {alerts.map(a => (
                <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{a.alertId}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{a.serviceKey || 'payment-api'}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">{a.metric}</span>
                    <span className="text-[10px] text-slate-400">Value: {a.value} (Threshold: {a.threshold})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{a.source || 'Datadog'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.status === 'TRIGGERED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {a.status === 'TRIGGERED' && (
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'ACKNOWLEDGED')}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        Acknowledge
                      </button>
                    )}
                    {a.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] hover:bg-emerald-500/20"
                      >
                        Resolve
                      </button>
                    )}
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
