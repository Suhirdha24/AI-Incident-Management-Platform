'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { fetchApi } from '@/lib/api';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Server,
  ArrowUpRight,
  RefreshCw,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/analytics/incidents');
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800/40 rounded w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/40 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-800/40 rounded-xl lg:col-span-2" />
          <div className="h-72 bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalIncidents: 128,
    openIncidents: 12,
    criticalIncidents: 4,
    mttrMinutes: 42,
    mttaMinutes: 7,
    servicesAtRisk: 3,
    mttrComparisonPercent: 18
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good afternoon, {user?.name.split(' ')[0] || 'Engineer'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here&apos;s what&apos;s happening across your production environment today.
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Live Metrics
        </button>
      </div>

      {/* TOP KPI CARDS GRID (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Incidents */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total</span>
            <Layers className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.totalIncidents}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Recorded history</span>
        </div>

        {/* Open Incidents */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Open</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500 tracking-tight">{kpis.openIncidents}</p>
          <span className="text-[10px] text-amber-500/80 mt-1 block font-medium">Requires attention</span>
        </div>

        {/* Critical Incidents */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Critical</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
          <p className="text-2xl font-black text-red-500 tracking-tight">{kpis.criticalIncidents}</p>
          <span className="text-[10px] text-red-400 mt-1 block font-medium">SEV-1 Active</span>
        </div>

        {/* MTTR */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">MTTR</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.mttrMinutes}m</p>
          <div className="flex items-center text-[10px] text-emerald-500 mt-1 font-semibold">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            ↓ {kpis.mttrComparisonPercent}% from last week
          </div>
        </div>

        {/* MTTA */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">MTTA</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.mttaMinutes}m</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Avg time to acknowledge</span>
        </div>

        {/* Services at Risk */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">At Risk</span>
            <Server className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-orange-500 tracking-tight">{kpis.servicesAtRisk}</p>
          <span className="text-[10px] text-orange-400 mt-1 block font-medium">Degraded or Critical</span>
        </div>
      </div>

      {/* AI OPERATIONS INSIGHT CARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-sky-500/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0 text-sky-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">AI Operations Insight</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/20">
                Signal Correlation
              </span>
            </div>
            <p className="text-sm font-medium text-white mt-1">
              &quot;3 incidents in the last 7 days share signals related to database connection pool exhaustion.&quot;
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Primary affected cluster: PostgreSQL checkout pool. Suggested action: Review PgBouncer connection max threshold.
            </p>
          </div>
        </div>

        <Link
          href="/incidents"
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center space-x-1.5 shrink-0"
        >
          <span>View Analysis</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INCIDENT TREND CHART */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Incident Frequency Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total detected incidents over time</p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
              {['7d', '30d', '90d'].map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    timeRange === r ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trend || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INCIDENT SEVERITY DONUT */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Severity Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution by impact level</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.severityBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.severityBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(data?.severityBreakdown || []).map((item: any, i: number) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICE HEALTH MATRIX & ACTIVE INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SERVICE HEALTH MATRIX */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Health Matrix</h3>
            <Link href="/services" className="text-xs text-sky-500 hover:underline flex items-center">
              View catalog <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Payment API', key: 'payment-api', status: 'CRITICAL', env: 'Production', openCount: 1 },
              { name: 'Auth Service', key: 'auth-service', status: 'HEALTHY', env: 'Production', openCount: 0 },
              { name: 'Order Service', key: 'order-service', status: 'HEALTHY', env: 'Production', openCount: 0 },
              { name: 'Customer Database', key: 'database', status: 'DEGRADED', env: 'Production', openCount: 1 },
              { name: 'Notification Service', key: 'notification-service', status: 'HEALTHY', env: 'Production', openCount: 0 }
            ].map(svc => (
              <div key={svc.key} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{svc.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{svc.env}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    svc.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    svc.status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    ● {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE INCIDENTS PREVIEW TABLE */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Production Incidents</h3>
              <Link href="/incidents" className="text-xs text-sky-500 hover:underline flex items-center">
                All Incidents <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                    <th className="pb-2">Incident ID</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                    <td className="py-3 font-mono font-bold text-sky-500">
                      <Link href="/incidents/INC-2026-0192">INC-2026-0192</Link>
                    </td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">
                      Payment API experiencing elevated error rates
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                        SEV-1
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        INVESTIGATING
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">32m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
