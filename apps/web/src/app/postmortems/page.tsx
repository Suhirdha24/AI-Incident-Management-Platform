'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function PostmortemsPage() {
  const [postmortems, setPostmortems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostmortem, setSelectedPostmortem] = useState<any>(null);

  const loadPostmortems = async () => {
    try {
      const res = await fetchApi('/postmortems');
      setPostmortems(res || []);
    } catch (err) {
      toast.error('Failed to load postmortems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostmortems();
  }, []);

  const handlePublish = async (pmId: string) => {
    try {
      await fetchApi(`/postmortems/${pmId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PUBLISHED' })
      });
      toast.success('Postmortem published successfully');
      loadPostmortems();
      if (selectedPostmortem?._id === pmId) {
        setSelectedPostmortem((prev: any) => ({ ...prev, status: 'PUBLISHED' }));
      }
    } catch (err) {
      toast.error('Failed to publish postmortem');
    }
  };

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">AI Incident Postmortems</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Automated post-incident root cause analysis, timeline reconstruction, and corrective action items.
        </p>
      </div>

      <div className="rounded bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Human-in-the-Loop Safeguard:</strong> AI postmortems require engineer validation prior to publishing.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {postmortems.map(pm => (
          <div key={pm._id} className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-terracotta-500">{pm.incidentId?.incidentId || 'INC-2026-0071'}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  pm.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {pm.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{pm.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{pm.content?.incidentOverview}</p>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Author: {pm.authorId?.name || 'Joshua (SRE)'}</span>
              <button
                onClick={() => setSelectedPostmortem(pm)}
                className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-800 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                Inspect Postmortem
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POSTMORTEM DETAIL MODAL */}
      {selectedPostmortem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-neutral-800 rounded w-full max-w-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto text-neutral-100">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-xs font-mono text-terracotta-500 font-semibold">{selectedPostmortem.incidentId?.incidentId}</span>
                <h2 className="text-base font-semibold text-white">{selectedPostmortem.title}</h2>
              </div>
              <button onClick={() => setSelectedPostmortem(null)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300">
              <div>
                <h4 className="font-mono font-semibold text-terracotta-500 uppercase tracking-wider text-[10px] mb-1">Incident Overview</h4>
                <p className="p-3 rounded bg-neutral-900 border border-neutral-800">{selectedPostmortem.content?.incidentOverview}</p>
              </div>

              <div>
                <h4 className="font-mono font-semibold text-terracotta-500 uppercase tracking-wider text-[10px] mb-1">Root Cause Analysis</h4>
                <p className="p-3 rounded bg-neutral-900 border border-neutral-800">{selectedPostmortem.content?.rootCauseAnalysis}</p>
              </div>

              <div>
                <h4 className="font-mono font-semibold text-terracotta-500 uppercase tracking-wider text-[10px] mb-1">Corrective Action Items</h4>
                <ul className="list-disc list-inside p-3 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                  {(selectedPostmortem.content?.correctiveActions || []).map((act: string, idx: number) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setSelectedPostmortem(null)}
                className="px-3.5 py-1.5 rounded text-neutral-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>
              {selectedPostmortem.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handlePublish(selectedPostmortem._id)}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  Publish Postmortem
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

