'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Server, ShieldCheck, AlertTriangle, GitBranch, Code2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [ownerTeam, setOwnerTeam] = useState('');
  const [repository, setRepository] = useState('');
  const [techStack, setTechStack] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await fetchApi('/services', {
        method: 'POST',
        body: JSON.stringify({
          name,
          key: key || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description,
          environment,
          ownerTeam,
          repository,
          techStack
        })
      });
      toast.success('Service registered successfully');
      setShowCreateModal(false);
      setName('');
      setKey('');
      setDescription('');
      setOwnerTeam('');
      setRepository('');
      setTechStack('');
      loadServices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create service');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Service Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Production microservices, database clusters, and active health monitoring statuses.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Register Service
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading microservice catalog...</div>
      ) : (
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
      )}

      {/* CREATE SERVICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-white">Register New Service</h2>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Analytics Pipeline"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Service Key / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. analytics-pipeline"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe microservice responsibilities..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Owner Team</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Infra"
                    value={ownerTeam}
                    onChange={e => setOwnerTeam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tech Stack</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Go, Kafka, Redis"
                    value={techStack}
                    onChange={e => setTechStack(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Repository URL</label>
                <input
                  type="text"
                  required
                  placeholder="github.com/opsai/analytics-pipeline"
                  value={repository}
                  onChange={e => setRepository(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                >
                  {createLoading ? 'Registering...' : 'Register Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
