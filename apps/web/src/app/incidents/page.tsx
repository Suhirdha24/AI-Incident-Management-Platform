'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { IncidentSeverity } from '@opsai/shared';
import { Search, Plus, AlertTriangle, ArrowUpRight, UserCheck } from 'lucide-react';
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
      case 'SEV-1': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'SEV-2': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'SEV-3': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DETECTED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ACKNOWLEDGED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'INVESTIGATING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MITIGATING': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Incidents Directory</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Active and historical production incident records with telemetry signal evidence.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Incident</span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-3.5 rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Incident ID, Title, or Description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded pl-9 pr-3.5 py-2 focus:outline-none focus:border-terracotta-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded px-3 py-2 focus:outline-none"
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
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded px-3 py-2 focus:outline-none"
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
      <div className="rounded bg-white dark:bg-[#171717] border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-neutral-800/40 rounded animate-pulse" />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-neutral-500 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">No active incidents found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No incident records matched your search parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase bg-neutral-50 dark:bg-neutral-900/50">
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Service & Title</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {incidents.map(inc => (
                  <tr key={inc._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-terracotta-500">
                      <Link href={`/incidents/${inc._id}`} className="hover:underline">
                        {inc.incidentId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium block">{inc.title}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {inc.serviceId?.name || 'Payment API'} • {inc.environment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {inc.assignedEngineerId ? (
                        <div className="flex items-center space-x-1.5 text-neutral-700 dark:text-neutral-300">
                          <UserCheck className="w-3.5 h-3.5 text-terracotta-500" />
                          <span className="truncate">{inc.assignedEngineerId.name}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[11px] italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 text-[11px] font-mono">
                      {new Date(inc.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/incidents/${inc._id}`}
                        className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-900 hover:bg-terracotta-500 hover:text-white text-neutral-700 dark:text-neutral-300 font-medium text-[11px] transition-colors inline-flex items-center gap-1 border border-neutral-200 dark:border-neutral-800"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-neutral-800 rounded w-full max-w-lg p-6 space-y-4 shadow-2xl text-neutral-100">
            <h2 className="text-base font-semibold text-white">Create Incident Record</h2>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment API Gateway elevated error rates"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded p-2.5 focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Severity Level</label>
                <select
                  value={newSeverity}
                  onChange={e => setNewSeverity(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded p-2.5 focus:outline-none"
                >
                  <option value="SEV-1">SEV-1 Critical</option>
                  <option value="SEV-2">SEV-2 High</option>
                  <option value="SEV-3">SEV-3 Medium</option>
                  <option value="SEV-4">SEV-4 Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Observed Anomaly / Impact</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe observed metric spike or error log signatures..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded p-2.5 focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded text-neutral-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-3.5 py-1.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-medium transition-colors"
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

