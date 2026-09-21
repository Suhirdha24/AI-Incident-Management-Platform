'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@opsai/shared';
import { ShieldCheck, ArrowRight, Lock, Mail, User, CheckCircle2, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ENGINEER);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#121212] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-neutral-100">
      {/* LEFT VISUAL PANEL */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-12 bg-[#121212] border-r border-neutral-800">
        <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-terracotta-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-neutral-100 tracking-tight">OpsAI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                v2.4.0
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Control Plane: Active</span>
          </div>
        </div>

        <div className="relative z-10 my-auto py-8 space-y-8 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-300">
              <Zap className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Join Enterprise Incident Operations Workspace</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white leading-snug">
              Provision SRE role-based workspace credentials.
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create your OpsAI account to participate in telemetry investigation, automated alert correlation, and AI-assisted incident response.
            </p>
          </div>

          <div className="rounded bg-neutral-900 border border-neutral-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-terracotta-500" />
                <span className="text-xs font-mono font-semibold text-neutral-200">Role-Based Access Control (RBAC)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-terracotta-500/10 text-terracotta-500 border border-terracotta-500/20">
                ENTERPRISE READY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Engineer Role:</span>
                  <span className="text-neutral-400 ml-1">Investigate incidents, view telemetry, add notes, and execute state transitions.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Incident Manager Role:</span>
                  <span className="text-neutral-400 ml-1">Reassign leads, escalate severity, review postmortems, and manage lifecycle.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200">Admin Role:</span>
                  <span className="text-neutral-400 ml-1">Manage service catalog, system users, integrations, and audit trail ledger.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-neutral-800 text-neutral-400 text-xs font-mono">
            <div>
              <span className="text-neutral-200 block font-semibold">JWT Secured</span>
              <span className="text-[10px] text-neutral-500">HttpOnly cookies & tokens</span>
            </div>
            <div>
              <span className="text-neutral-200 block font-semibold">Bcrypt Encryption</span>
              <span className="text-[10px] text-neutral-500">Salted password hashing</span>
            </div>
            <div>
              <span className="text-neutral-200 block font-semibold">Audit Logging</span>
              <span className="text-[10px] text-neutral-500">Hashed operational trail</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-neutral-500 flex items-center justify-between border-t border-neutral-800 pt-4">
          <span>&copy; 2026 OpsAI Platform</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-terracotta-500" /> SOC2 Type II Certified
          </span>
        </div>
      </div>

      {/* RIGHT SIGN-UP FORM PANEL */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#121212]">
        <div className="w-full max-w-sm space-y-6">
          {/* TAB HEADER */}
          <div className="flex rounded bg-neutral-900 border border-neutral-800 p-1">
            <Link
              href="/login"
              className="flex-1 py-1.5 text-center text-xs font-medium rounded text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-1.5 text-center text-xs font-medium rounded bg-neutral-800 text-white shadow-sm"
            >
              Create Account
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-neutral-100 tracking-tight">Create SRE Account</h2>
            <p className="text-xs text-neutral-400 mt-1">Register new credentials to access the OpsAI platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Select Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded px-3 py-2.5 focus:outline-none focus:border-terracotta-500 transition-colors"
              >
                <option value={UserRole.ENGINEER}>ENGINEER (SRE / DevOps)</option>
                <option value={UserRole.INCIDENT_MANAGER}>INCIDENT MANAGER</option>
                <option value={UserRole.ADMIN}>ADMIN (System Lead)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Register & Launch Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-xs text-center text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-terracotta-500 hover:underline font-medium">
              Sign In
            </Link>
          </p>

          <p className="text-[10px] text-center text-neutral-500 font-mono">
            Encrypted TLS 1.3 • OpsAI Control Plane Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
