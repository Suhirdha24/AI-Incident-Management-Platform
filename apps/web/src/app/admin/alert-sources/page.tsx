'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Radio, CheckCircle2, ShieldCheck, Activity, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AlertSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/admin/alert-sources')
      .then(res => setSources(res || []))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load alert sources');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-terracotta-500" />
            Monitoring Alert Sources & Ingestion Streams
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configured telemetry webhooks, Datadog/CloudWatch integrations, and real-time alert ingestion bridges.
          </p>
        </div>
        <button
          onClick={() => toast.info('Integrations are pre-configured via environment settings')}
          className="px-3 py-1.5 rounded text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Integration
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-neutral-500">Loading alert sources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map(src => (
            <div
              key={src.id || src.name}
              className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded bg-terracotta-500/10 text-terracotta-500 border border-terracotta-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{src.name}</h3>
                  <div className="mt-1 space-y-1">
                    <span className="inline-block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Protocol: {src.type}
                    </span>
                    {src.endpoint && (
                      <div className="text-[11px] font-mono text-neutral-500 truncate max-w-[220px]">
                        {src.endpoint}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                {src.status || 'ACTIVE'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

