'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { IncidentSeverity, IncidentStatus } from '@opsai/shared';
import { Search, Plus, Filter, AlertTriangle, ArrowUpRight, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSeverity, setNewSeverity] = useState(IncidentSeverity.SEV_2);
  const [createLoading, setCreateLoading] = useState(false);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (severityFilter) params.append('severity', severityFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetchApi(`/incidents?${params.toString()}`);
      setIncidents(res.incidents || []);
    } catch (err: any) {
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [search, severityFilter, statusFilter]);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      // First get a service ID
      const services = await fetchApi('/services');
      const serviceId = services[0]?._id;

      await fetchApi('/incidents', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          serviceId,
          severity: newSeverity,
          environment: 'Production'
        })
      });

      toast.success('Incident created successfully');
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      loadIncidents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create incident');
    } finally {
      setCreateLoading(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'SEV-1': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'SEV-2': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'SEV-3': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DETECTED': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'ACKNOWLEDGED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'INVESTIGATING': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MITIGATING': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Incidents Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active and historical production incident records with AI correlation signals.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Incident
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by Incident ID, Title, or Description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="SEV-1">SEV-1 Critical</option>
            <option value="SEV-2">SEV-2 High</option>
            <option value="SEV-3">SEV-3 Medium</option>
            <option value="SEV-4">SEV-4 Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="DETECTED">Detected</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="MITIGATING">Mitigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* INCIDENTS TABLE */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-800/40 rounded animate-pulse" />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No active incidents found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No incident records matched your filter parameters. Adjust your search criteria or create a new incident.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-semibold bg-slate-50/50 dark:bg-slate-950/50">
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Service & Title</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {incidents.map(inc => (
                  <tr key={inc._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-500">
                      <Link href={`/incidents/${inc._id}`} className="hover:underline">
                        {inc.incidentId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 dark:text-white font-bold block">{inc.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {inc.serviceId?.name || 'Payment API'} • {inc.environment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {inc.assignedEngineerId ? (
                        <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span className="truncate">{inc.assignedEngineerId.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(inc.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/incidents/${inc._id}`}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE INCIDENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-white">Create New Incident</h2>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment API elevated error rates"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Severity</label>
                <select
                  value={newSeverity}
                  onChange={e => setNewSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="SEV-1">SEV-1 Critical</option>
                  <option value="SEV-2">SEV-2 High</option>
                  <option value="SEV-3">SEV-3 Medium</option>
                  <option value="SEV-4">SEV-4 Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description / Observed Impact</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe metric anomaly or customer impact..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md shadow-sky-500/20"
                >
                  {createLoading ? 'Creating...' : 'Trigger Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
