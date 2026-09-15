'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Sparkles, FileText, CheckCircle2, Edit3, ShieldAlert } from 'lucide-react';
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Incident Postmortems</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Automated post-incident root cause analysis, timeline reconstruction, and corrective action items.
        </p>
      </div>

      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>AI Generated Content — Review Required:</strong> AI postmortems require engineer validation prior to publishing.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {postmortems.map(pm => (
          <div key={pm._id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-500">{pm.incidentId?.incidentId || 'INC-2026-0071'}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  pm.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {pm.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{pm.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{pm.content?.incidentOverview}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Author: {pm.authorId?.name || 'Joshua (SRE)'}</span>
              <button
                onClick={() => setSelectedPostmortem(pm)}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold hover:bg-sky-500/20"
              >
                Inspect Postmortem
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POSTMORTEM DETAIL MODAL */}
      {selectedPostmortem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-sky-400 font-bold">{selectedPostmortem.incidentId?.incidentId}</span>
                <h2 className="text-lg font-bold text-white">{selectedPostmortem.title}</h2>
              </div>
              <button onClick={() => setSelectedPostmortem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[10px] mb-1">Incident Overview</h4>
                <p className="p-3 rounded-lg bg-slate-950 border border-slate-800">{selectedPostmortem.content?.incidentOverview}</p>
              </div>

              <div>
                <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[10px] mb-1">Root Cause Analysis</h4>
                <p className="p-3 rounded-lg bg-slate-950 border border-slate-800">{selectedPostmortem.content?.rootCauseAnalysis}</p>
              </div>

              <div>
                <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[10px] mb-1">Corrective Action Items</h4>
                <ul className="list-disc list-inside p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  {(selectedPostmortem.content?.correctiveActions || []).map((act: string, idx: number) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPostmortem(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
              {selectedPostmortem.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handlePublish(selectedPostmortem._id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
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
