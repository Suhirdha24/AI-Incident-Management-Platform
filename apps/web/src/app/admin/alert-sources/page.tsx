'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Radio, CheckCircle2 } from 'lucide-react';

export default function AlertSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/admin/alert-sources')
      .then(res => setSources(res || []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Monitoring Alert Sources</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configured telemetry webhooks and alert ingestion streams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map(src => (
          <div key={src.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{src.name}</h3>
                <span className="text-[10px] font-mono text-slate-400">Type: {src.type}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {src.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
