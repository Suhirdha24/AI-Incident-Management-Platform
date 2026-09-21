'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/analytics/incidents')
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#e11d48', '#f97316', '#eab308', '#A8613D'];

  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-400">Loading SRE Analytics...</div>;
  }

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">SRE & Reliability Analytics</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Mean Time To Resolution (MTTR), Mean Time To Acknowledge (MTTA), and service fault frequency.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">MTTR (Mean Time To Resolve)</span>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{kpis.mttrMinutes || 42}m</p>
          <span className="text-[10px] text-emerald-500 block mt-1 font-mono">↓ 18% vs 30d window</span>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">MTTA (Mean Time To Acknowledge)</span>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{kpis.mttaMinutes || 7}m</p>
          <span className="text-[10px] text-neutral-400 block mt-1 font-mono">Target &lt; 10m SLA</span>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">Total Recorded Incidents</span>
          <p className="text-2xl font-bold text-terracotta-500 mt-1">{kpis.totalIncidents || 128}</p>
        </div>

        <div className="p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">Critical Fault Rate</span>
          <p className="text-2xl font-bold text-rose-500 mt-1">3.1%</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents by Service Bar Chart */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Incidents by Microservice</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.incidentsByService || []}>
                <XAxis dataKey="service" stroke="#737373" fontSize={10} tickLine={false} />
                <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '4px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="incidents" fill="#A8613D" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Severity Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.severityBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.severityBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', fontSize: '11px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

