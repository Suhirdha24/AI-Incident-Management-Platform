'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Server, ShieldCheck, AlertTriangle, GitBranch, Code2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const res = await fetchApi('/services');
      setServices(res || []);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Service Catalog</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Production microservices, database clusters, and active health monitoring statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(svc => (
          <div key={svc._id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{svc.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">{svc.key} • {svc.environment}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  svc.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  svc.status === 'DEGRADED' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  ● {svc.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {svc.description}
              </p>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" /> Owner Team:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{svc.ownerTeam}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400" /> Stack:
                  </span>
                  <span className="font-mono text-[11px] text-slate-300">{svc.techStack}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Open Incidents: <strong>{svc.openIncidentsCount || 0}</strong></span>
              <span className="text-sky-400 hover:underline cursor-pointer font-medium">View Telemetry &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
