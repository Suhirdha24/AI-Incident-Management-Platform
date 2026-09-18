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

  // Assign modal state
  const [users, setUsers] = useState<any[]>([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetchApi('/admin/users');
      setUsers(res || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleAssignEngineer = async (engineerIdToAssign: string) => {
    if (!engineerIdToAssign) return;
    setAssignLoading(true);
    try {
      await fetchApi(`/incidents/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ engineerId: engineerIdToAssign })
      });
      toast.success('Engineer assigned successfully');
      setShowAssignModal(false);
      loadIncidentData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign engineer');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSeverityChange = async (newSev: string) => {
    try {
      await fetchApi(`/incidents/${id}/severity`, {
        method: 'PATCH',
        body: JSON.stringify({ severity: newSev })
      });
      toast.success(`Severity updated to ${newSev}`);
      loadIncidentData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update severity');
    }
  };

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
    loadUsers();

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
        <div className="h-10 bg-zinc-800/40 rounded w-1/2" />
        <div className="h-64 bg-zinc-800/40 rounded-xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-zinc-800/40 rounded-xl" />
          <div className="h-48 bg-zinc-800/40 rounded-xl" />
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
    <div className="space-y-6 pb-16 text-zinc-100 font-sans">
      {/* Top Breadcrumb Back */}
      <Link href="/incidents" className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors font-mono">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Console
      </Link>

      {/* HEADER BAR */}
      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-semibold text-zinc-100 bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-700">
              {incident?.incidentId || 'INC-2026-0192'}
            </span>
            <select
              value={incident?.severity || 'SEV-1'}
              onChange={e => handleSeverityChange(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 text-xs font-mono font-semibold rounded px-2 py-0.5 text-zinc-200 focus:outline-none"
            >
              <option value="SEV-1">SEV-1 Critical</option>
              <option value="SEV-2">SEV-2 High</option>
              <option value="SEV-3">SEV-3 Medium</option>
              <option value="SEV-4">SEV-4 Low</option>
            </select>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
              {incident?.status || 'INVESTIGATING'}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            {incident?.title}
          </h1>
        </div>

        {/* State-Machine Aware Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {incident?.status === 'DETECTED' && (
            <button
              onClick={() => handleStatusChange('ACKNOWLEDGED')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              Acknowledge
            </button>
          )}

          {incident?.status === 'ACKNOWLEDGED' && (
            <button
              onClick={() => handleStatusChange('INVESTIGATING')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              Start Investigation
            </button>
          )}

          {incident?.status === 'INVESTIGATING' && (
            <button
              onClick={() => handleStatusChange('MITIGATING')}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              Mark Mitigating
            </button>
          )}

          {incident?.status === 'MITIGATING' && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve Incident
            </button>
          )}

          {incident?.status === 'RESOLVED' && (
            <button
              onClick={() => handleStatusChange('CLOSED')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors border border-zinc-700/60"
            >
              Close Record
            </button>
          )}

          <button
            onClick={handleTriggerAI}
            disabled={analyzing}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {/* SECTION 1: INCIDENT OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs">
        <div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Target Service</span>
          <span className="text-zinc-100 font-medium mt-0.5 block">{incident?.serviceId?.name || 'Payment API'}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Environment</span>
          <span className="text-zinc-100 font-medium mt-0.5 block">{incident?.environment || 'Production'}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Assigned Engineer</span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-zinc-200 font-medium">{incident?.assignedEngineerId?.name || 'Unassigned'}</span>
            <button
              onClick={() => setShowAssignModal(true)}
              className="text-[10px] font-mono text-sky-400 hover:underline font-semibold"
            >
              [Assign]
            </button>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Observed Impact</span>
          <span className="text-red-400 font-medium mt-0.5 block">{incident?.impactSummary || '12,483 requests affected'}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase block">Active Duration</span>
          <span className="text-zinc-100 font-mono mt-0.5 block">{incident?.durationMinutes ? `${incident.durationMinutes}m` : '32m 14s'}</span>
        </div>
      </div>

      {/* SECTION 2: AI INCIDENT INVESTIGATION PANEL */}
      <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/80 pb-4 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                AI Investigation
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Signal Correlation Active
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Automated signal correlation and hypothesis generation engine</p>
            </div>
          </div>

          <button
            onClick={() => setShowAiDrawer(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium hover:bg-zinc-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            Ask Incident Assistant
          </button>
        </div>

        {/* Probable Cause & Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-zinc-950/80 p-4 rounded-lg border border-zinc-800/80">
          <div className="md:col-span-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Probable Cause</span>
            <h3 className="text-base font-semibold text-zinc-100 mt-1">{analysis.probableCause}</h3>
            <p className="text-xs text-zinc-400 mt-1">{analysis.potentialImpact}</p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400 font-medium">Confidence Score</span>
              <span className="text-emerald-400 font-mono font-semibold">{Math.round((analysis.confidence || 0.87) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(analysis.confidence || 0.87) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* CONFIRMED EVIDENCE VS HYPOTHESIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed Evidence */}
          <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed Evidence
            </span>
            <ul className="space-y-2 text-xs text-zinc-300">
              {(analysis.confirmedEvidence || []).map((ev: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-semibold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Hypothesis (Explicit Warning) */}
          <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Hypothesis — Verify with Operational Evidence
            </span>
            <ul className="space-y-2 text-xs text-zinc-300">
              {(analysis.hypotheses || []).map((hyp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-semibold">•</span>
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDED INVESTIGATION & MITIGATION */}
        <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Recommended Investigation Steps
            </span>
            <button
              onClick={() => copyToClipboard(analysis.recommendedInvestigation?.join('\n') || '')}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono"
            >
              <Copy className="w-3 h-3" /> Copy Steps
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 font-normal">
            {(analysis.recommendedInvestigation || []).map((step: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* SECTION 3: INCIDENT METRICS CHARTS */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Real-Time Telemetry Metrics</h3>
            <p className="text-xs text-zinc-400">Error rate and database connection utilization during incident window</p>
          </div>
          <span className="text-xs text-red-400 font-mono font-medium px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
            Anomaly Window
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.6} />
              <XAxis dataKey="timestamp" stroke="#71717a" fontSize={10} tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <YAxis stroke="#71717a" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '11px', color: '#f4f4f5' }} />
              <Line type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={2} name="Error Rate (%)" />
              <Line type="monotone" dataKey="dbConnectionsPercent" stroke="#3b82f6" strokeWidth={2} name="DB Connections (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TERMINAL LOGS PANEL */}
      <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800/80 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-semibold">payment-api-stdout.log</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Production Pod Stream</span>
        </div>

        <div className="space-y-1 text-[11px] leading-relaxed max-h-48 overflow-y-auto p-2.5 bg-black/80 rounded-lg">
          <p className="text-zinc-400"><span className="text-zinc-600">14:30:12</span> <span className="text-emerald-400 font-semibold">INFO</span> Deployment v2.8.4 initialized on payment-api-pod-7f9x2</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:31:58</span> <span className="text-emerald-400 font-semibold">INFO</span> Payment checkout request started - TxID: 8f9b20a1</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:32:04</span> <span className="text-red-400 font-semibold">ERROR</span> Database connection timeout after 5000ms [Postgres: pg_pool_exhausted]</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:32:07</span> <span className="text-red-400 font-semibold">ERROR</span> Failed to acquire database connection from pool (max_connections=50 reached)</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:32:15</span> <span className="text-amber-400 font-semibold">WARN</span> PgBouncer connection pool utilization reached 96% threshold</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:32:28</span> <span className="text-red-400 font-semibold">ERROR</span> Payment request failed with HTTP 500 InternalServerError - ClientAborted</p>
          <p className="text-zinc-400"><span className="text-zinc-600">14:33:01</span> <span className="text-zinc-300 font-semibold">ALERT</span> Datadog Webhook trigger sent: ALERT-1001 Error Rate 18.7% &gt; 5%</p>
        </div>
      </div>

      {/* SECTION 4 & 5: TIMELINE & CORRELATED ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIMELINE */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100">Incident Timeline</h3>
          <div className="relative border-l border-zinc-800 ml-3 space-y-5">
            {(events || []).map((evt: any) => (
              <div key={evt._id || evt.title} className="relative pl-5">
                <span className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-zinc-400 ring-4 ring-zinc-950" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-200">{evt.title}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CORRELATED ALERTS */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">Correlated Telemetry Alerts</h3>
            <span className="text-xs text-zinc-400 font-mono">4 Alerts</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
            4 related telemetry alerts grouped based on service key, 10-minute time window, and signal proximity.
          </div>

          <div className="space-y-2">
            {(alerts || []).map((a: any) => (
              <div key={a._id || a.alertId} className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-medium text-zinc-200 block">{a.alertId} • {a.metric}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Value: {a.value} (Threshold: {a.threshold})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
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
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100">Deployment Correlation</h3>
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Deployment payment-api v2.8.4 occurred 2 minutes before incident onset.</span>
          </div>

          {(recentDeployments || []).map((dep: any) => (
            <div key={dep._id || dep.version} className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200 font-mono">{dep.serviceKey} {dep.version}</span>
                <span className="text-[10px] text-zinc-500 font-mono">Commit {dep.commitHash}</span>
              </div>
              <p className="text-zinc-400">{dep.changes}</p>
              <span className="text-[10px] text-zinc-500 font-mono block">Deployed by {dep.deployedBy}</span>
            </div>
          ))}
        </div>

        {/* SIMILAR INCIDENTS */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100">Similar Historical Incidents</h3>
          <div className="space-y-3">
            {(similarIncidents || []).map((sim: any) => (
              <div key={sim.incidentId} className="p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-zinc-200">{sim.incidentId}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {Math.round(sim.similarityScore * 100)}% Match
                  </span>
                </div>
                <p className="font-medium text-zinc-200">{sim.title}</p>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <p><strong>Root Cause:</strong> {sim.rootCause}</p>
                  <p><strong>Resolution:</strong> {sim.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: COLLABORATION & INVESTIGATION NOTES */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-zinc-400" />
          Engineering Collaboration & Notes
        </h3>

        <div className="space-y-3">
          {(comments || []).map((c: any) => (
            <div key={c._id} className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                  {c.userId?.name || 'Engineer'}
                  {c.isNote && (
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 uppercase font-mono">
                      Note
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-3 pt-2">
          <textarea
            rows={2}
            placeholder="Add investigation note or update team..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-3 focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isNote}
                onChange={e => setIsNote(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-800 text-zinc-100 accent-zinc-100"
              />
              <span>Mark as Investigation Note</span>
            </label>

            <button
              type="submit"
              disabled={commentLoading}
              className="px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {commentLoading ? 'Posting...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>

      {/* AI INVESTIGATION ASSISTANT DRAWER */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Incident Assistant
              </span>
              <button onClick={() => setShowAiDrawer(false)} className="text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">Suggested Questions</span>
              <div className="space-y-1.5">
                {[
                  'Why is this incident SEV-1?',
                  'What changed before the incident?',
                  'What evidence supports the root cause?',
                  'Have we seen this before?'
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleAskAI(q)}
                    className="w-full text-left p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-xs text-zinc-300 font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Q&A Chat History */}
            <div className="space-y-3 pt-4 border-t border-zinc-800/80">
              {aiChatHistory.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <p className="font-semibold text-zinc-300">Q: {item.q}</p>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI about this incident..."
              value={aiQuestion}
              onChange={e => setAiQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAI(aiQuestion)}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-zinc-500"
            />
            <button
              onClick={() => handleAskAI(aiQuestion)}
              disabled={aiAsking}
              className="p-2.5 rounded-lg bg-white text-zinc-950 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-base font-semibold text-zinc-100">Resolve Incident {incident?.incidentId}</h2>

            <form onSubmit={handleResolveIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-300 block mb-1">Confirmed Root Cause</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database connection pool exhaustion caused by unindexed join"
                  value={rootCause}
                  onChange={e => setRootCause(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Resolution Summary</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Scaled PgBouncer connection pool max size from 50 to 100 connections."
                  value={resolutionSummary}
                  onChange={e => setResolutionSummary(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Actions Taken</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated deployment config and restarted checkout pods"
                  value={actionsTaken}
                  onChange={e => setActionsTaken(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="font-medium text-zinc-300 block mb-1">Customer / System Impact</label>
                <input
                  type="text"
                  required
                  value={impactText}
                  onChange={e => setImpactText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold shadow-sm hover:bg-zinc-200 transition-colors"
                >
                  Resolve Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN ENGINEER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-semibold text-zinc-100">Assign Lead Engineer</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-medium text-zinc-300 block">Select Team Member</label>
              <select
                value={selectedEngineerId}
                onChange={e => setSelectedEngineerId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-2.5 rounded-lg focus:outline-none focus:border-zinc-500"
              >
                <option value="">-- Choose Engineer or Manager --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role}) - {u.email}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedEngineerId || assignLoading}
                  onClick={() => handleAssignEngineer(selectedEngineerId)}
                  className="px-4 py-2 rounded-lg bg-white text-zinc-950 font-semibold shadow-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {assignLoading ? 'Assigning...' : 'Assign Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

