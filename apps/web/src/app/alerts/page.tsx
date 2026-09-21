'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
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
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Alert Intelligence</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Real-time telemetry metric threshold alerts correlated into production incident groups.
        </p>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">ACTIVE ALERTS</span>
          <p className="text-2xl font-bold text-amber-500 mt-1">{alerts.filter(a => a.status === 'TRIGGERED').length}</p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">CRITICAL SEVERITY</span>
          <p className="text-2xl font-bold text-rose-500 mt-1">{alerts.filter(a => a.severity === 'CRITICAL').length}</p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">ACKNOWLEDGED</span>
          <p className="text-2xl font-bold text-terracotta-500 mt-1">{alerts.filter(a => a.status === 'ACKNOWLEDGED').length}</p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">RESOLVED</span>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{alerts.filter(a => a.status === 'RESOLVED').length}</p>
        </div>
      </div>

      {/* ALERTS TABLE */}
      <div className="rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase bg-neutral-50 dark:bg-neutral-900/50">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Metric & Breach</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {alerts.map(a => (
                <tr key={a._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-terracotta-500">{a.alertId}</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-900 dark:text-neutral-100">{a.serviceKey || 'payment-api'}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100 block">{a.metric}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Value: {a.value} (Threshold: {a.threshold})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      a.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">{a.source || 'Datadog'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      a.status === 'TRIGGERED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {a.status === 'TRIGGERED' && (
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'ACKNOWLEDGED')}
                        className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 font-medium text-[11px] border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200"
                      >
                        Acknowledge
                      </button>
                    )}
                    {a.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px] hover:bg-emerald-500/20"
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

