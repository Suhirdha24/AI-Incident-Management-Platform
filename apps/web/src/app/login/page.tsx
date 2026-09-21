'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@opsai/shared';
import { ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F5F1] text-neutral-900 font-sans selection:bg-neutral-200 selection:text-neutral-900">
      {/* LEFT VISUAL PANEL (7 Cols on LG) */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-[#FAF8F5] border-r border-neutral-200">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-terracotta-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-neutral-900 tracking-tight">OpsAI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200/70 text-neutral-600 border border-neutral-300">
                v2.4.0
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neutral-600">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Control Plane: Active</span>
          </div>
        </div>

        {/* Hero & Live Incident Card */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Enterprise SRE Incident Operations Platform</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-snug">
              Operational clarity when production cannot wait.
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Unified incident response, real-time alert correlation, and root-cause intelligence engineered for site reliability teams.
            </p>
          </div>

          {/* REALISTIC TELEMETRY INCIDENT CARD */}
          <div className="rounded bg-white border border-neutral-200 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-semibold text-neutral-900">INC-2026-8941</span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-medium text-neutral-800">Payment Gateway Latency Surge</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-50 text-rose-600 border border-rose-200 whitespace-nowrap">
                SEV-1 CRITICAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#F7F5F1] border border-neutral-200">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Signal Correlation</span>
                <span className="text-xs font-semibold text-neutral-900 mt-1 block">14 Telemetry Alerts Grouped</span>
                <span className="text-[11px] text-rose-600 mt-0.5 block font-mono">Error Rate: 14.8% (+11.2%)</span>
              </div>
              <div className="p-3 rounded bg-[#F7F5F1] border border-neutral-200">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">AI Root Cause Analysis</span>
                <span className="text-xs font-semibold text-neutral-900 mt-1 block truncate">DB Connection Pool Starvation</span>
                <span className="text-[11px] text-emerald-600 mt-0.5 block font-mono">Confidence: 94%</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-600 border-t border-neutral-100">
              <span className="flex items-center text-emerald-700 gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Evidence Log & Commit Traces Attached
              </span>
              <span className="text-neutral-400 font-mono text-[10px]">Human-in-the-Loop Safeguard</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-neutral-200">
            <div className="space-y-1">
              <span className="text-xs font-medium text-neutral-800 block">Sub-10s Alert Correlation</span>
              <p className="text-[11px] text-neutral-500">Clusters telemetry alerts into unified incident graphs.</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-neutral-800 block">Root Cause Hypotheses</span>
              <p className="text-[11px] text-neutral-500">Maps commits, deployments, and log stack traces.</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-neutral-800 block">Audit & Postmortems</span>
              <p className="text-[11px] text-neutral-500">Generates structured postmortem reports ready for SRE review.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-200 pt-4">
          <span>&copy; 2026 OpsAI Platform</span>
          <span className="flex items-center gap-1.5 text-neutral-600">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-500" /> SOC2 Type II & ISO 27001 Certified
          </span>
        </div>
      </div>

      {/* RIGHT SIGN-IN FORM PANEL (5 Cols on LG) */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 bg-white border-l border-neutral-200">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-2">
            <div className="w-7 h-7 rounded bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-terracotta-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold text-base text-neutral-900 tracking-tight">OpsAI</span>
          </div>

          {/* TAB HEADER */}
          <div className="flex rounded bg-[#F7F5F1] border border-neutral-200 p-1">
            <button
              type="button"
              className="flex-1 py-1.5 text-center text-xs font-medium rounded bg-white text-neutral-900 shadow-sm border border-neutral-200/80"
            >
              Sign In
            </button>
            <a
              href="/register"
              className="flex-1 py-1.5 text-center text-xs font-medium rounded text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Create Account
            </a>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Sign in to Operations Console</h2>
            <p className="text-xs text-neutral-500 mt-1">Enter your credentials or choose a 1-click role to explore.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="engineer@opsai.com"
                  className="w-full bg-[#F7F5F1] border border-neutral-200 text-neutral-900 text-xs rounded pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-700">Password</label>
                <a href="#" className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F7F5F1] border border-neutral-200 text-neutral-900 text-xs rounded pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-neutral-600 cursor-pointer">
                <input type="checkbox" className="rounded bg-neutral-100 border-neutral-300 text-terracotta-500 focus:ring-0 accent-terracotta-500" />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-xs text-center text-neutral-500">
            Don't have an account?{' '}
            <a href="/register" className="text-terracotta-500 hover:underline font-medium">
              Create Account
            </a>
          </p>

          {/* DEMO ACCOUNTS ACCELERATOR */}
          <div className="pt-6 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500">1-Click Demo Access</span>
              <span className="text-[10px] text-terracotta-500 font-mono">Instant Role Access</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ENGINEER)}
                className="p-2.5 rounded bg-[#F7F5F1] hover:bg-neutral-200/60 border border-neutral-200 text-left transition-colors group"
              >
                <span className="text-[11px] font-medium text-neutral-900 block group-hover:text-terracotta-600 transition-colors">
                  Engineer
                </span>
                <span className="text-[9px] text-neutral-500 block font-mono mt-0.5">Vishal (DevOps)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.INCIDENT_MANAGER)}
                className="p-2.5 rounded bg-[#F7F5F1] hover:bg-neutral-200/60 border border-neutral-200 text-left transition-colors group"
              >
                <span className="text-[11px] font-medium text-neutral-900 block group-hover:text-terracotta-600 transition-colors truncate">
                  Manager
                </span>
                <span className="text-[9px] text-neutral-500 block font-mono mt-0.5 truncate">Joshua (SRE)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin(UserRole.ADMIN)}
                className="p-2.5 rounded bg-[#F7F5F1] hover:bg-neutral-200/60 border border-neutral-200 text-left transition-colors group"
              >
                <span className="text-[11px] font-medium text-neutral-900 block group-hover:text-terracotta-600 transition-colors">
                  Admin
                </span>
                <span className="text-[9px] text-neutral-500 block font-mono mt-0.5">Elena (System)</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-neutral-400 font-mono">
            Encrypted TLS 1.3 • OpsAI Control Plane Protocol
          </p>
        </div>
      </div>
    </div>
  );
}


