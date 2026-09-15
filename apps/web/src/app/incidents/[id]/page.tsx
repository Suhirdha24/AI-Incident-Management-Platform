'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { getSocket } from '@/lib/socket';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
  RotateCw,
  Copy,
  ArrowLeft,
  Send,
  MessageSquare,
  Activity,
  Layers,
  FileCode2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { toast } from 'sonner';

export default function IncidentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isNote, setIsNote] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // Modals & Panels
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAiDrawer, setShowAiDrawer] = useState(false);

  // Resolve form
  const [rootCause, setRootCause] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [impactText, setImpactText] = useState('12,483 requests affected');

  // AI Q&A Assistant state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [aiAsking, setAiAsking] = useState(false);

  const loadIncidentData = async () => {
    try {
      const res = await fetchApi(`/incidents/${id}`);
      setData(res);
    } catch (err: any) {
      toast.error('Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidentData();

    // Socket.IO real-time updates
    const socket = getSocket();
    socket.emit('join_incident', id);

    socket.on('incident.updated', () => {
      loadIncidentData();
    });

    socket.on('incident.comment.created', () => {
      loadIncidentData();
    });

    return () => {
      socket.off('incident.updated');
      socket.off('incident.comment.created');
    };
  }, [id]);

  const handleTriggerAI = async () => {
    setAnalyzing(true);
    toast.info('Triggering AI Investigation Engine...');
    try {
      await fetchApi(`/incidents/${id}/analyze`, { method: 'POST' });
      toast.success('AI Analysis scheduled');
      setTimeout(() => {
        loadIncidentData();
        setAnalyzing(false);
      }, 2500);
    } catch (err: any) {
      toast.error(err.message || 'AI Analysis failed');
      setAnalyzing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetchApi(`/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      toast.success(`Status updated to ${newStatus}`);
      loadIncidentData();
    } catch (err: any) {
      toast.error(err.message || 'State transition rejected');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await fetchApi(`/incidents/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment, isNote })
      });
      setNewComment('');
      toast.success(isNote ? 'Investigation note saved' : 'Comment posted');
      loadIncidentData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleResolveIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/incidents/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({
          rootCause,
          resolutionSummary,
          actionsTaken,
          impact: impactText
        })
      });
      toast.success('Incident resolved successfully');
      setShowResolveModal(false);
      loadIncidentData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve incident');
    }
  };

  const handleAskAI = async (questionText: string) => {
    if (!questionText) return;
    setAiAsking(true);
    try {
      const res = await fetchApi<{ answer: string }>(`/incidents/${id}/ask-ai`, {
        method: 'POST',
        body: JSON.stringify({ question: questionText })
      });
      setAiChatHistory(prev => [...prev, { q: questionText, a: res.answer }]);
      setAiQuestion('');
    } catch (err: any) {
      toast.error('AI Assistant unavailable');
    } finally {
      setAiAsking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="p-12 space-y-6 animate-pulse">
        <div className="h-10 bg-slate-800/40 rounded w-1/2" />
        <div className="h-64 bg-slate-800/40 rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-slate-800/40 rounded-xl" />
          <div className="h-48 bg-slate-800/40 rounded-xl" />
        </div>
      </div>
    );
  }

  const { incident, alerts, recentDeployments, metrics, events, comments, similarIncidents } = data || {};
  const analysis = incident?.analysis || {
    probableCause: 'Database connection pool exhaustion',
    confidence: 0.87,
    confirmedEvidence: [
      'Database connections reached 96% utilization',
      'Payment API latency increased to 1650ms',
      'Database timeout errors surged by 400%',
      'Similar incident INC-2026-0071 occurred previously'
    ],
    hypotheses: [
      'Database connection pool exhaustion is the primary cause of checkout query timeouts.',
      'Deployment v2.8.4 introduced connection leak or reduced max pool size configuration.'
    ],
    recommendedInvestigation: [
      'Inspect PgBouncer database connection utilization metrics',
      'Review recent deployment v2.8.4 configuration changes',
      'Check database timeout errors and active query locks',
      'Review connection pool configuration parameter (default: 50)'
    ],
    recommendedMitigation: [
      'Increase PgBouncer connection pool max size from 50 to 100',
      'Restart payment-api pods to clear deadlocked connections'
    ]
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb Back */}
      <Link href="/incidents" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Console
      </Link>

      {/* HEADER BAR */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-sm font-mono font-bold text-sky-500 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
              {incident?.incidentId || 'INC-2026-0192'}
            </span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
              incident?.severity === 'SEV-1' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-orange-500/10 text-orange-500 border-orange-500/30'
            }`}>
              {incident?.severity || 'SEV-1'}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
              {incident?.status || 'INVESTIGATING'}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {incident?.title}
          </h1>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleStatusChange('ACKNOWLEDGED')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Acknowledge
          </button>
          <button
            onClick={() => handleStatusChange('MITIGATING')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Mark Mitigating
          </button>
          <button
            onClick={handleTriggerAI}
            disabled={analyzing}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 hover:opacity-90"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
          <button
            onClick={() => setShowResolveModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:bg-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolve Incident
          </button>
        </div>
      </div>

      {/* SECTION 1: INCIDENT OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Service</span>
          <span className="text-slate-900 dark:text-white font-bold mt-0.5 block">{incident?.serviceId?.name || 'Payment API'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Environment</span>
          <span className="text-slate-900 dark:text-white font-bold mt-0.5 block">{incident?.environment || 'Production'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned Engineer</span>
          <span className="text-sky-400 font-bold mt-0.5 block">{incident?.assignedEngineerId?.name || 'Vishal (Engineer)'}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Observed Impact</span>
          <span className="text-red-400 font-bold mt-0.5 block">12,483 requests affected</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Duration</span>
          <span className="text-slate-900 dark:text-white font-bold mt-0.5 block font-mono">32m 14s</span>
        </div>
      </div>

      {/* SECTION 2: AI INCIDENT INVESTIGATION PANEL */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Investigation Console
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI Analysis Complete
                </span>
              </h2>
              <p className="text-xs text-slate-400">Automated signal correlation and hypothesis generation engine</p>
            </div>
          </div>

          <button
            onClick={() => setShowAiDrawer(true)}
            className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Ask AI Assistant
          </button>
        </div>

        {/* Probable Cause & Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="md:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PROBABLE ROOT CAUSE</span>
            <h3 className="text-lg font-black text-sky-400 mt-1">{analysis.probableCause}</h3>
            <p className="text-xs text-slate-300 mt-1">{analysis.potentialImpact}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Confidence Score</span>
              <span className="text-sky-400 font-bold font-mono">{Math.round((analysis.confidence || 0.87) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(analysis.confidence || 0.87) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* CONFIRMED EVIDENCE VS HYPOTHESIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed Evidence */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              CONFIRMED EVIDENCE
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {(analysis.confirmedEvidence || []).map((ev: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Hypothesis (Explicit Warning) */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              AI HYPOTHESIS (Requires Engineer Verification)
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {(analysis.hypotheses || []).map((hyp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">?</span>
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDED INVESTIGATION & MITIGATION */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              RECOMMENDED INVESTIGATION STEPS
            </span>
            <button
              onClick={() => copyToClipboard(analysis.recommendedInvestigation?.join('\n') || '')}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Copy Steps
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 font-medium">
            {(analysis.recommendedInvestigation || []).map((step: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* SECTION 3: INCIDENT METRICS CHARTS */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Telemetry Metrics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Error rate and database connection utilization during incident window</p>
          </div>
          <span className="text-xs text-red-500 font-bold font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
            Anomoly Window Highlighted
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', color: '#fff' }} />
              <Line type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={2} name="Error Rate (%)" />
              <Line type="monotone" dataKey="dbConnectionsPercent" stroke="#38bdf8" strokeWidth={2} name="DB Connections (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TERMINAL LOGS PANEL */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-bold ml-2">payment-api-stdout.log</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Production Pod Terminal</span>
        </div>

        <div className="space-y-1 text-[11px] leading-relaxed max-h-48 overflow-y-auto p-2 bg-black/60 rounded-lg">
          <p className="text-slate-400"><span className="text-slate-600">14:30:12</span> <span className="text-emerald-400 font-bold">INFO</span> Deployment v2.8.4 initialized on payment-api-pod-7f9x2</p>
          <p className="text-slate-400"><span className="text-slate-600">14:31:58</span> <span className="text-emerald-400 font-bold">INFO</span> Payment checkout request started - TxID: 8f9b20a1</p>
          <p className="text-slate-400"><span className="text-slate-600">14:32:04</span> <span className="text-red-400 font-bold">ERROR</span> Database connection timeout after 5000ms [Postgres: pg_pool_exhausted]</p>
          <p className="text-slate-400"><span className="text-slate-600">14:32:07</span> <span className="text-red-400 font-bold">ERROR</span> Failed to acquire database connection from pool (max_connections=50 reached)</p>
          <p className="text-slate-400"><span className="text-slate-600">14:32:15</span> <span className="text-amber-400 font-bold">WARN</span> PgBouncer connection pool utilization reached 96% threshold</p>
          <p className="text-slate-400"><span className="text-slate-600">14:32:28</span> <span className="text-red-400 font-bold">ERROR</span> Payment request failed with HTTP 500 InternalServerError - ClientAborted</p>
          <p className="text-slate-400"><span className="text-slate-600">14:33:01</span> <span className="text-purple-400 font-bold">CRIT</span> Datadog Webhook trigger sent: ALERT-1001 Error Rate 18.7% &gt; 5%</p>
        </div>
      </div>

      {/* SECTION 4 & 5: TIMELINE & CORRELATED ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIMELINE */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Incident Timeline</h3>
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
            {(events || []).map((evt: any) => (
              <div key={evt._id || evt.title} className="relative pl-6">
                <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{evt.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CORRELATED ALERTS */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Correlated Related Alerts</h3>
            <span className="text-xs text-sky-400 font-mono">4 Alerts Correlated</span>
          </div>

          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
            &quot;4 related alerts correlated into this incident based on service key, 10-minute time window, and signal similarity.&quot;
          </div>

          <div className="space-y-2">
            {(alerts || []).map((a: any) => (
              <div key={a._id || a.alertId} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block">{a.alertId} • {a.metric}</span>
                  <span className="text-[10px] text-slate-400">Value: {a.value} (Threshold: {a.threshold})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                  {a.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6 & 7: RECENT DEPLOYMENTS & SIMILAR INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT DEPLOYMENTS */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Deployments</h3>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Recent deployment detected 2 minutes prior to incident onset.</span>
          </div>

          {(recentDeployments || []).map((dep: any) => (
            <div key={dep._id || dep.version} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white font-mono">{dep.serviceKey} {dep.version}</span>
                <span className="text-[10px] text-slate-400 font-mono">Commit {dep.commitHash}</span>
              </div>
              <p className="text-slate-400">{dep.changes}</p>
              <span className="text-[10px] text-slate-500 block">Deployed by {dep.deployedBy}</span>
            </div>
          ))}
        </div>

        {/* SIMILAR INCIDENTS */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Similar Historical Incidents</h3>
          <div className="space-y-3">
            {(similarIncidents || []).map((sim: any) => (
              <div key={sim.incidentId} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-500">{sim.incidentId}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Similarity {Math.round(sim.similarityScore * 100)}%
                  </span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{sim.title}</p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p><strong>Root Cause:</strong> {sim.rootCause}</p>
                  <p><strong>Resolution:</strong> {sim.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: COLLABORATION & INVESTIGATION NOTES */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-500" />
          Collaboration & Notes Feed
        </h3>

        <div className="space-y-3">
          {(comments || []).map((c: any) => (
            <div key={c._id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {c.userId?.name || 'Engineer'}
                  {c.isNote && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase font-mono">
                      Note
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-3 pt-2">
          <textarea
            rows={2}
            placeholder="Add investigation note or update team..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isNote}
                onChange={e => setIsNote(e.target.checked)}
                className="rounded bg-slate-900 border-slate-800 text-amber-500"
              />
              <span>Mark as Investigation Note</span>
            </label>

            <button
              type="submit"
              disabled={commentLoading}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              {commentLoading ? 'Posting...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>

      {/* AI INVESTIGATION ASSISTANT DRAWER */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                AI Investigation Assistant
              </span>
              <button onClick={() => setShowAiDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suggested Questions</span>
              <div className="space-y-1.5">
                {[
                  'Why is this incident SEV-1?',
                  'What changed before the incident?',
                  'What are the strongest root-cause indicators?',
                  'Have we seen this before?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleAskAI(q)}
                    className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-sky-300 font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Q&A Chat History */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {aiChatHistory.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-300">Q: {item.q}</p>
                  <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-200 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI about this incident..."
              value={aiQuestion}
              onChange={e => setAiQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAI(aiQuestion)}
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 focus:outline-none"
            />
            <button
              onClick={() => handleAskAI(aiQuestion)}
              disabled={aiAsking}
              className="p-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-white">Resolve Incident {incident?.incidentId}</h2>

            <form onSubmit={handleResolveIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Confirmed Root Cause</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database connection pool exhaustion caused by unindexed join"
                  value={rootCause}
                  onChange={e => setRootCause(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Resolution Summary</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Scaled PgBouncer connection pool max size from 50 to 100 connections."
                  value={resolutionSummary}
                  onChange={e => setResolutionSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Actions Taken</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated deployment config and restarted checkout pods"
                  value={actionsTaken}
                  onChange={e => setActionsTaken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Customer / System Impact</label>
                <input
                  type="text"
                  required
                  value={impactText}
                  onChange={e => setImpactText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Resolve Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
