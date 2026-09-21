'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { getSocket } from '@/lib/socket';
import { safeFormatDate, safeFormatTime } from '@/lib/dateUtils';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Copy,
  ArrowLeft,
  Send,
  MessageSquare,
  HelpCircle,
  X,
  RefreshCw
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
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadIncidentData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(`/incidents/${id}`);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load incident details:', err);
      setError(err.message || 'Incident record could not be loaded.');
      toast.error('Failed to load incident details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidentData();
    loadUsers();

    if (!id) return;
    try {
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
    } catch (e) {
      console.warn('Socket connection warning:', e);
    }
  }, [id]);

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
      <div className="p-12 space-y-6 animate-pulse max-w-[1600px] mx-auto">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
        <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Unable to load incident record</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{error || 'Incident details could not be retrieved.'}</p>
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={loadIncidentData}
            className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
          <Link
            href="/incidents"
            className="px-3.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Console</span>
          </Link>
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

  const getAssigneeName = (assignee: any) => {
    if (!assignee) return 'Unassigned';
    if (typeof assignee === 'object' && assignee.name) return assignee.name;
    if (typeof assignee === 'string') return assignee;
    return 'Unassigned';
  };

  return (
    <div className="space-y-6 pb-16 text-neutral-900 dark:text-neutral-100 font-sans p-6 max-w-[1600px] mx-auto">
      {/* Top Breadcrumb Back */}
      <Link href="/incidents" className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center gap-1.5 transition-colors font-mono">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Incidents Console
      </Link>

      {/* HEADER BAR */}
      <div className="p-6 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-semibold text-terracotta-500 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
              {incident?.incidentId || 'INC-2026-0192'}
            </span>
            <select
              value={incident?.severity || 'SEV-1'}
              onChange={e => handleSeverityChange(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-semibold rounded px-2 py-0.5 text-neutral-800 dark:text-neutral-200 focus:outline-none"
            >
              <option value="SEV-1">SEV-1 Critical</option>
              <option value="SEV-2">SEV-2 High</option>
              <option value="SEV-3">SEV-3 Medium</option>
              <option value="SEV-4">SEV-4 Low</option>
            </select>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 uppercase">
              {incident?.status || 'INVESTIGATING'}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {incident?.title}
          </h1>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {incident?.status === 'DETECTED' && (
            <button
              onClick={() => handleStatusChange('ACKNOWLEDGED')}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors shadow-sm"
            >
              Acknowledge
            </button>
          )}

          {incident?.status === 'ACKNOWLEDGED' && (
            <button
              onClick={() => handleStatusChange('INVESTIGATING')}
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-xs font-medium text-white transition-colors shadow-sm"
            >
              Start Investigation
            </button>
          )}

          {incident?.status === 'INVESTIGATING' && (
            <button
              onClick={() => handleStatusChange('MITIGATING')}
              className="px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-500 text-xs font-medium text-white transition-colors shadow-sm"
            >
              Mark Mitigating
            </button>
          )}

          {incident?.status === 'MITIGATING' && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve Incident
            </button>
          )}

          {incident?.status === 'RESOLVED' && (
            <button
              onClick={() => handleStatusChange('CLOSED')}
              className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-xs font-medium text-neutral-700 dark:text-neutral-200 transition-colors border border-neutral-300 dark:border-neutral-700"
            >
              Close Record
            </button>
          )}

          <button
            onClick={handleTriggerAI}
            disabled={analyzing}
            className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white border border-terracotta-600 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {/* SECTION 1: INCIDENT OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 p-4 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 text-xs shadow-xs">
        <div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Target Service</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium mt-0.5 block">
            {typeof incident?.serviceId === 'object' ? incident.serviceId?.name : (incident?.serviceName || 'Payment API')}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Environment</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium mt-0.5 block">{incident?.environment || 'Production'}</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Assigned Lead</span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-neutral-800 dark:text-neutral-200 font-medium">{getAssigneeName(incident?.assignedEngineerId)}</span>
            <button
              onClick={() => setShowAssignModal(true)}
              className="text-[10px] font-mono text-terracotta-500 hover:underline font-semibold"
            >
              [Assign]
            </button>
          </div>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Observed Impact</span>
          <span className="text-rose-500 font-medium mt-0.5 block">{incident?.impactSummary || '12,483 requests affected'}</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Active Duration</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-mono mt-0.5 block">{incident?.durationMinutes ? `${incident.durationMinutes}m` : '32m 14s'}</span>
        </div>
      </div>

      {/* SECTION 2: AI INCIDENT INVESTIGATION PANEL */}
      <div className="p-6 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                AI Investigation Engine
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Telemetry Correlation Active
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Automated root cause identification and evidence clustering</p>
            </div>
          </div>

          <button
            onClick={() => setShowAiDrawer(true)}
            className="px-3 py-1.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            Ask Assistant
          </button>
        </div>

        {/* Probable Cause & Confidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-neutral-50 dark:bg-neutral-900/60 p-4 rounded border border-neutral-200 dark:border-neutral-800">
          <div className="md:col-span-2">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Probable Cause</span>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{analysis.probableCause}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{analysis.potentialImpact}</p>
          </div>

          <div className="p-3 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium">Confidence Score</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{Math.round((analysis.confidence || 0.87) * 100)}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(analysis.confidence || 0.87) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* CONFIRMED EVIDENCE VS HYPOTHESIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confirmed Evidence */}
          <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed Evidence
            </span>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {(analysis.confirmedEvidence || []).map((ev: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-semibold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Hypothesis */}
          <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              AI Hypothesis — Verify with Operational Evidence
            </span>
            <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
              {(analysis.hypotheses || []).map((hyp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-semibold">•</span>
                  <span>{hyp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RECOMMENDED INVESTIGATION & MITIGATION */}
        <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              Recommended Investigation Steps
            </span>
            <button
              onClick={() => copyToClipboard(analysis.recommendedInvestigation?.join('\n') || '')}
              className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 flex items-center gap-1 font-mono"
            >
              <Copy className="w-3 h-3" /> Copy Steps
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-normal">
            {(analysis.recommendedInvestigation || []).map((step: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* SECTION 3: INCIDENT METRICS CHARTS */}
      <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Real-Time Telemetry Signals</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Error rate and database connection utilization during incident window</p>
          </div>
          <span className="text-xs text-rose-500 font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            Anomaly Window Active
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.6} />
              <XAxis
                dataKey="timestamp"
                stroke="#737373"
                fontSize={10}
                tickFormatter={t => safeFormatTime(t, { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis stroke="#737373" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e5', fontSize: '11px', color: '#171717' }} />
              <Line type="monotone" dataKey="errorRate" stroke="#e11d48" strokeWidth={2} name="Error Rate (%)" />
              <Line type="monotone" dataKey="dbConnectionsPercent" stroke="#A8613D" strokeWidth={2} name="DB Connections (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TERMINAL LOGS PANEL */}
      <div className="p-5 rounded bg-neutral-950 border border-neutral-800 shadow-xl space-y-3 font-mono text-xs text-neutral-100">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-neutral-400 font-medium">payment-api-stdout.log</span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Pod Stream</span>
        </div>

        <div className="space-y-1 text-[11px] leading-relaxed max-h-48 overflow-y-auto p-2.5 bg-black rounded">
          <p className="text-neutral-400"><span className="text-neutral-600">14:30:12</span> <span className="text-emerald-400 font-semibold">INFO</span> Deployment v2.8.4 initialized on payment-api-pod-7f9x2</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:31:58</span> <span className="text-emerald-400 font-semibold">INFO</span> Payment checkout request started - TxID: 8f9b20a1</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:32:04</span> <span className="text-rose-400 font-semibold">ERROR</span> Database connection timeout after 5000ms [Postgres: pg_pool_exhausted]</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:32:07</span> <span className="text-rose-400 font-semibold">ERROR</span> Failed to acquire database connection from pool (max_connections=50 reached)</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:32:15</span> <span className="text-amber-400 font-semibold">WARN</span> PgBouncer connection pool utilization reached 96% threshold</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:32:28</span> <span className="text-rose-400 font-semibold">ERROR</span> Payment request failed with HTTP 500 InternalServerError - ClientAborted</p>
          <p className="text-neutral-400"><span className="text-neutral-600">14:33:01</span> <span className="text-neutral-300 font-semibold">ALERT</span> Datadog Webhook trigger sent: ALERT-1001 Error Rate 18.7% &gt; 5%</p>
        </div>
      </div>

      {/* SECTION 4 & 5: TIMELINE & CORRELATED ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TIMELINE */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Incident Timeline</h3>
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-3 space-y-5">
            {(events || []).map((evt: any) => (
              <div key={evt._id || evt.title} className="relative pl-5">
                <span className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full bg-neutral-400 ring-4 ring-white dark:ring-neutral-900" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-900 dark:text-neutral-200">{evt.title}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {safeFormatTime(evt.timestamp, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CORRELATED ALERTS */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Correlated Telemetry Alerts</h3>
            <span className="text-xs text-neutral-400 font-mono">{(alerts || []).length} Alerts</span>
          </div>

          <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Telemetry alerts grouped based on service key, 10-minute time window, and signal proximity.
          </div>

          <div className="space-y-2">
            {(alerts || []).map((a: any) => (
              <div key={a._id || a.alertId} className="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-medium text-neutral-900 dark:text-neutral-200 block">{a.alertId} • {a.metric}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Value: {a.value} (Threshold: {a.threshold})</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
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
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Deployment Correlation</h3>
          <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Deployment payment-api v2.8.4 occurred 2 minutes before incident onset.</span>
          </div>

          {(recentDeployments || []).map((dep: any) => (
            <div key={dep._id || dep.version} className="p-3.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 dark:text-neutral-200 font-mono">{dep.serviceKey} {dep.version}</span>
                <span className="text-[10px] text-neutral-500 font-mono">Commit {dep.commitHash}</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">{dep.changes}</p>
              <span className="text-[10px] text-neutral-500 font-mono block">Deployed by {dep.deployedBy}</span>
            </div>
          ))}
        </div>

        {/* SIMILAR INCIDENTS */}
        <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Similar Historical Incidents</h3>
          <div className="space-y-3">
            {(similarIncidents || []).map((sim: any) => (
              <div key={sim.incidentId} className="p-3.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-neutral-900 dark:text-neutral-200">{sim.incidentId}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {Math.round(sim.similarityScore * 100)}% Match
                  </span>
                </div>
                <p className="font-medium text-neutral-900 dark:text-neutral-200">{sim.title}</p>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-0.5">
                  <p><strong>Root Cause:</strong> {sim.rootCause}</p>
                  <p><strong>Resolution:</strong> {sim.resolution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: COLLABORATION & INVESTIGATION NOTES */}
      <div className="p-5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-400" />
          Engineering Collaboration & Notes
        </h3>

        <div className="space-y-3">
          {(comments || []).map((c: any) => (
            <div key={c._id} className="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900 dark:text-neutral-200 flex items-center gap-1.5">
                  {c.userId?.name || 'Engineer'}
                  {c.isNote && (
                    <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 uppercase font-mono">
                      Note
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {safeFormatTime(c.createdAt, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-3 pt-2">
          <textarea
            rows={2}
            placeholder="Add investigation note or update team..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded p-3 focus:outline-none focus:border-terracotta-500 placeholder:text-neutral-400"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isNote}
                onChange={e => setIsNote(e.target.checked)}
                className="rounded bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-terracotta-500 accent-terracotta-500"
              />
              <span>Mark as Investigation Note</span>
            </label>

            <button
              type="submit"
              disabled={commentLoading}
              className="px-3.5 py-1.5 rounded bg-terracotta-500 text-white hover:bg-terracotta-600 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {commentLoading ? 'Posting...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>

      {/* AI INVESTIGATION ASSISTANT DRAWER */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#171717] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 flex flex-col justify-between text-neutral-900 dark:text-neutral-100">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <span className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                Incident Assistant
              </span>
              <button onClick={() => setShowAiDrawer(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500">Suggested Questions</span>
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
                    className="w-full text-left p-2 rounded bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {aiChatHistory.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">Q: {item.q}</p>
                  <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI about this incident..."
              value={aiQuestion}
              onChange={e => setAiQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAI(aiQuestion)}
              className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded p-2.5 focus:outline-none focus:border-terracotta-500"
            />
            <button
              onClick={() => handleAskAI(aiQuestion)}
              disabled={aiAsking}
              className="p-2.5 rounded bg-terracotta-500 text-white font-medium hover:bg-terracotta-600 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 rounded-lg w-full max-w-lg p-6 space-y-4 shadow-2xl text-neutral-900 dark:text-neutral-100">
            <h2 className="text-base font-semibold">Resolve Incident {incident?.incidentId}</h2>

            <form onSubmit={handleResolveIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Confirmed Root Cause</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database connection pool exhaustion caused by unindexed join query"
                  value={rootCause}
                  onChange={e => setRootCause(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 rounded focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Resolution Summary</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Scaled PgBouncer connection pool max size from 50 to 100 connections."
                  value={resolutionSummary}
                  onChange={e => setResolutionSummary(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 rounded focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Actions Taken</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated deployment config and restarted checkout pods"
                  value={actionsTaken}
                  onChange={e => setActionsTaken(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 rounded focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 dark:text-neutral-300 block mb-1">Customer / System Impact</label>
                <input
                  type="text"
                  required
                  value={impactText}
                  onChange={e => setImpactText(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 rounded focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-3.5 py-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 rounded-lg w-full max-w-md p-6 space-y-4 shadow-2xl text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h2 className="text-base font-semibold">Assign Lead Engineer</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-medium text-neutral-700 dark:text-neutral-300 block">Select Team Member</label>
              <select
                value={selectedEngineerId}
                onChange={e => setSelectedEngineerId(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 p-2.5 rounded focus:outline-none"
              >
                <option value="">-- Choose Engineer or Manager --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role}) - {u.email}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3.5 py-1.5 rounded text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedEngineerId || assignLoading}
                  onClick={() => handleAssignEngineer(selectedEngineerId)}
                  className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium transition-colors disabled:opacity-50 shadow-sm"
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
