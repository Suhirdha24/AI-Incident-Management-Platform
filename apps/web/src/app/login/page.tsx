'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@opsai/shared';
import { Activity, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2, Zap, Terminal, Server, GitCommit } from 'lucide-react';
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* LEFT VISUAL PANEL (7 Cols on LG) */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-zinc-950 border-r border-zinc-800/80">
        {/* Subtle grid accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-zinc-100 tracking-tight">IncidentPulse AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                v2.8.4
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Control Plane: Operational</span>
          </div>
        </div>

        {/* Main Operational Hero & Live Terminal Card */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-300">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Autonomous SRE Incident Console</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white leading-tight">
              Detect anomalies. Pinpoint root cause. Automate remediation.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unified incident intelligence platform engineered for DevOps and Reliability teams. Correlate telemetry noise into actionable, evidence-backed root cause diagnoses in real-time.
            </p>
          </div>

          {/* REALISTIC SRE TELEMETRY TERMINAL CARD */}
          <div className="rounded-xl bg-zinc-900/90 border border-zinc-800/90 p-5 shadow-2xl backdrop-blur-md space-y-4">
            {/* Incident Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-mono font-semibold text-zinc-200">INC-2026-0192</span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs font-medium text-zinc-300">Payment API Gateway</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20 whitespace-nowrap">
                SEV-1 CRITICAL
              </span>
            </div>

            {/* Correlated Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Signal Correlation</span>
                <span className="text-xs font-semibold text-zinc-200 mt-1 block">4 Active Telemetry Alerts</span>
                <span className="text-[11px] text-red-400 mt-0.5 block font-mono">Error Rate: 18.7% (+14.2%)</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/60">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">AI Root Cause Engine</span>
                <span className="text-xs font-semibold text-zinc-200 mt-1 block truncate">DB Connection Exhaustion</span>
                <span className="text-[11px] text-emerald-400 mt-0.5 block font-mono">Confidence: 87%</span>
              </div>
            </div>

            {/* Evidence & Remediation Footer */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60">
              <span className="flex items-center text-emerald-400 gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Evidence Log & Traces Attached
              </span>
              <span className="text-zinc-500 font-mono text-[10px]">Auto-Remediation Ready</span>
            </div>
          </div>

          {/* Core Feature Bullet Points */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-zinc-800/60">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-200 block">Sub-15s Correlation</span>
              <p className="text-[11px] text-zinc-500">Groups thousands of metric alerts into single incident graphs.</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-200 block">Automated RCA</span>
              <p className="text-[11px] text-zinc-500">Maps commits, deployments, and logs directly to root causes.</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-200 block">1-Click Postmortems</span>
              <p className="text-[11px] text-zinc-500">Generates comprehensive postmortems ready for review.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-800/60 pt-4">
          <span>&copy; 2026 IncidentPulse Technologies</span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Type II Certified & ISO 27001
          </span>
        </div>
      </div>

      {/* RIGHT SIGN-IN FORM PANEL (5 Cols on LG) */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 bg-zinc-950 border-l border-zinc-800/40">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base text-zinc-100 tracking-tight">IncidentPulse AI</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Sign in to Console</h2>
            <p className="text-xs text-zinc-400 mt-1">Enter your credentials or select a 1-click demo persona below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@opsai.com"
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-xs rounded-lg pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-xs rounded-lg pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-0 accent-zinc-100" />
                <span>Remember session</span>
              </label>
            </div>

            {/* High-Contrast Enterprise Solid White Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-lg text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* QUICK DEMO ACCOUNTS ACCELERATOR */}
          <div className="pt-6 border-t border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">1-Click Technical Demo Logins</span>
              <span className="text-[10px] text-emerald-400 font-mono">Instant Access</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ENGINEER)}
                className="p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all group"
              >
                <span className="text-[11px] font-medium text-zinc-200 block group-hover:text-white transition-colors">
                  Engineer
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono mt-0.5">Vishal (DevOps)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.INCIDENT_MANAGER)}
                className="p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all group"
              >
                <span className="text-[11px] font-medium text-zinc-200 block group-hover:text-white transition-colors truncate">
                  Manager
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono mt-0.5 truncate">Joshua (SRE)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ADMIN)}
                className="p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-left transition-all group"
              >
                <span className="text-[11px] font-medium text-zinc-200 block group-hover:text-white transition-colors">
                  Admin
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono mt-0.5">Elena (System)</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-zinc-500 font-mono">
            Encrypted End-to-End • TLS 1.3 • Incident Control Plane
          </p>
        </div>
      </div>
    </div>
  );
}

