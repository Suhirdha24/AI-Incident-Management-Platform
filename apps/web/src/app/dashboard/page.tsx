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

  const COLORS = ['#e11d48', '#f97316', '#eab308', '#A8613D'];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-6">
        <div className="h-8 bg-neutral-800/40 rounded w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-800/40 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-neutral-800/40 rounded lg:col-span-2" />
          <div className="h-72 bg-neutral-800/40 rounded" />
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
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Good afternoon, {user?.name.split(' ')[0] || 'Engineer'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Production environment status and telemetry signal summary.
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="self-start sm:self-auto px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Signals</span>
        </button>
      </div>

      {/* TOP KPI CARDS GRID (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Incidents */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total</span>
            <Layers className="w-4 h-4 text-terracotta-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{kpis.totalIncidents}</p>
          <span className="text-[10px] text-neutral-500 mt-1 block">Recorded history</span>
        </div>

        {/* Open Incidents */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Open</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-500 tracking-tight">{kpis.openIncidents}</p>
          <span className="text-[10px] text-amber-500/80 mt-1 block font-medium">Requires triage</span>
        </div>

        {/* Critical Incidents */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Critical</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <p className="text-2xl font-bold text-rose-500 tracking-tight">{kpis.criticalIncidents}</p>
          <span className="text-[10px] text-rose-400 mt-1 block font-medium">SEV-1 Active</span>
        </div>

        {/* MTTR */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">MTTR</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{kpis.mttrMinutes}m</p>
          <div className="flex items-center text-[10px] text-emerald-500 mt-1 font-mono">
            <TrendingDown className="w-3 h-3 mr-0.5" />
            ↓ {kpis.mttrComparisonPercent}% vs 7d ago
          </div>
        </div>

        {/* MTTA */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">MTTA</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{kpis.mttaMinutes}m</p>
          <span className="text-[10px] text-neutral-500 mt-1 block">Avg acknowledgment</span>
        </div>

        {/* Services at Risk */}
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">At Risk</span>
            <Server className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500 tracking-tight">{kpis.servicesAtRisk}</p>
          <span className="text-[10px] text-orange-400 mt-1 block font-medium">Degraded catalog</span>
        </div>
      </div>

      {/* AI OPERATIONS INSIGHT CARD */}
      <div className="p-4 rounded bg-neutral-900 border border-neutral-800 text-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center shrink-0 text-terracotta-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-terracotta-500">AI Signal Correlation</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                PostgreSQL Cluster
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-200 mt-0.5">
              &quot;3 incidents in the last 7 days share signals related to database connection pool exhaustion.&quot;
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Affected service: Payment API Gateway. Recommended action: Increase PgBouncer max client connections threshold.
            </p>
          </div>
        </div>

        <Link
          href="/incidents"
          className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <span>View Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INCIDENT TREND CHART */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Incident Frequency Trend</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Total detected incidents over time</p>
            </div>
            <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded text-xs font-medium border border-neutral-200 dark:border-neutral-800">
              {['7d', '30d', '90d'].map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                    timeRange === r ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
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
                    <stop offset="5%" stopColor="#A8613D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A8613D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '4px', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#A8613D" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INCIDENT SEVERITY DONUT */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Severity Breakdown</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Distribution by impact severity</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.severityBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.severityBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '4px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(data?.severityBreakdown || []).map((item: any, i: number) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-neutral-600 dark:text-neutral-400 text-[11px] truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICE HEALTH MATRIX & ACTIVE INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SERVICE HEALTH MATRIX */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Service Health Matrix</h3>
            <Link href="/services" className="text-xs text-terracotta-500 hover:underline flex items-center">
              Catalog <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Payment API', key: 'payment-api', status: 'CRITICAL', env: 'Production', openCount: 1 },
              { name: 'Auth Service', key: 'auth-service', status: 'HEALTHY', env: 'Production', openCount: 0 },
              { name: 'Order Service', key: 'order-service', status: 'HEALTHY', env: 'Production', openCount: 0 },
              { name: 'Customer Database', key: 'database', status: 'DEGRADED', env: 'Production', openCount: 1 },
              { name: 'Notification Service', key: 'notification-service', status: 'HEALTHY', env: 'Production', openCount: 0 }
            ].map(svc => (
              <div key={svc.key} className="p-3 rounded border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">{svc.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{svc.env}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    svc.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    svc.status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    ● {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE INCIDENTS PREVIEW TABLE */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Active Production Incidents</h3>
              <Link href="/incidents" className="text-xs text-terracotta-500 hover:underline flex items-center">
                All Incidents <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase">
                    <th className="pb-2">Incident ID</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors">
                    <td className="py-3 font-mono font-semibold text-terracotta-500">
                      <Link href="/incidents/INC-2026-0192">INC-2026-0192</Link>
                    </td>
                    <td className="py-3 font-medium text-neutral-900 dark:text-neutral-100">
                      Payment API experiencing elevated error rates
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        SEV-1
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        INVESTIGATING
                      </span>
                    </td>
                    <td className="py-3 text-neutral-400 font-mono">32m</td>
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
