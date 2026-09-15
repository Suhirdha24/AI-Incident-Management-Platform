'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@opsai/shared';
import { Cpu, ShieldCheck, Activity, AlertTriangle, ArrowRight, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      await demoLogin(role);
      toast.success(`Logged in as ${role.replace('_', ' ')}`);
    } catch (err: any) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-white font-sans overflow-hidden">
      {/* LEFT VISUAL PANEL */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/80">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* Brand */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">IncidentPulse AI</h1>
            <p className="text-xs text-sky-400 font-medium">AI-Powered Incident Intelligence</p>
          </div>
        </div>

        {/* Operational Graphic / System Diagram */}
        <div className="relative z-10 my-auto space-y-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous AI SRE Workflow
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight mt-4 text-white leading-tight">
              Detect. Investigate. Resolve.
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Correlate telemetry signals, pinpoint root causes with 87%+ confidence, and automate postmortems in real-time.
            </p>
          </div>

          {/* Operational Topology Preview Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4 max-w-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-slate-200">INC-2026-0192 • Payment API</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                SEV-1 CRITICAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block font-medium">CORRELATED SIGNALS</span>
                <span className="text-slate-200 font-bold mt-1 block">4 Active Alerts</span>
                <span className="text-[10px] text-red-400 mt-0.5 block">Error Rate 18.7%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block font-medium">AI PROBABLE CAUSE</span>
                <span className="text-sky-400 font-bold mt-1 block truncate">DB Connection Exhaustion</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Confidence: 87%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center text-emerald-400 gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirmed Evidence Attached
              </span>
              <span className="text-slate-500 font-mono">v2.8.4 Deployed 32m ago</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; 2026 IncidentPulse AI Platform</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> SOC2 Type II Certified
          </span>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to IncidentPulse Console</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your credentials or choose a quick demo role persona.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@opsai.com"
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-slate-900 border-slate-800 text-sky-500 focus:ring-0" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sky-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* QUICK DEMO ACCOUNTS ACCELERATOR */}
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">1-Click Technical Demo Logins</span>
              <span className="text-[10px] text-sky-400 font-mono">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ENGINEER)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-[11px] font-bold text-white block group-hover:text-sky-400 transition-colors">
                  Engineer
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Vishal (DevOps)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.INCIDENT_MANAGER)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-[11px] font-bold text-white block group-hover:text-amber-400 transition-colors">
                  Incident Manager
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Joshua (SRE)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ADMIN)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <span className="text-[11px] font-bold text-white block group-hover:text-purple-400 transition-colors">
                  Admin
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Elena (System)</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            Secure Enterprise Incident Intelligence & System Resilience
          </p>
        </div>
      </div>
    </div>
  );
}
