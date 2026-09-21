'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  AlertTriangle,
  Clock,
  Zap,
  Lock,
  Sun,
  Moon,
  Server,
  GitBranch,
  BarChart3,
  Search
} from 'lucide-react';

export default function LandingPage() {
  const { user, loading, theme, toggleTheme } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-dark-bg text-neutral-900 dark:text-neutral-100 font-sans selection:bg-terracotta-500/20 selection:text-terracotta-600 transition-colors">
      {/* Subtle Technical Background Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-terracotta-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
            OpsAI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <a href="#platform" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Platform</a>
          <a href="#incidents" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">AI Investigation</a>
          <a href="#workflow" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Workflow</a>
          <a href="#security" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Security & Trust</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="px-4 py-2 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>{user ? "Open Console" : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto pt-20 pb-16 px-6 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-200/60 dark:bg-neutral-800/80 border border-neutral-300/60 dark:border-neutral-700/60 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
          <span>OpsAI 2.8 — AI-Powered Incident Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-neutral-900 dark:text-white max-w-4xl mx-auto">
          Operational clarity when production cannot wait.
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          OpsAI unifies alerts, telemetry metrics, deployments, incident history, and evidence-backed AI investigation into a single, high-precision SRE workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="px-5 py-2.5 rounded bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <span>Open Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#workflow"
            className="px-5 py-2.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            View Incident Workflow
          </a>
        </div>
      </section>

      {/* REALISTIC PRODUCT PREVIEW MOCKUP */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-xl bg-white dark:bg-dark-surface border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden p-1">
          {/* Browser Window Header */}
          <div className="h-9 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="ml-2 text-[11px] text-neutral-400">opsai.internal/incidents/INC-2026-0192</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">OpsAI SRE Workspace</span>
          </div>

          {/* Realistic Product Interface Mockup */}
          <div className="p-6 bg-warm-50 dark:bg-dark-bg space-y-6 text-xs text-neutral-900 dark:text-neutral-100">
            {/* Top Bar Mockup */}
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-bold text-terracotta-500">INC-2026-0192</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">SEV-1 CRITICAL</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 font-semibold uppercase">INVESTIGATING</span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Payment API elevated error rate & connection pool saturation</h3>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-medium">Assign Lead</span>
                <span className="px-3 py-1 rounded bg-terracotta-500 text-white font-semibold">Resolve Incident</span>
              </div>
            </div>

            {/* Grid 2-Column Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Main Section */}
              <div className="lg:col-span-2 space-y-4">
                {/* AI Investigation Report */}
                <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-terracotta-500" />
                      <span className="font-semibold text-sm">AI Investigation Diagnosis</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                      87% Confidence
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">Probable Root Cause</span>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">Database connection pool exhaustion (96% utilization)</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Evidence
                        </span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">• PgBouncer pool reached 96% limit</p>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">• API HTTP 500 error rate: 18.7%</p>
                      </div>

                      <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> AI Hypothesis
                        </span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">• Deployment v2.8.4 introduced query lock</p>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">• Dynamic connection pool expansion required</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Mockup */}
                <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Telemetry Error & Latency Surge</span>
                    <span className="text-[10px] font-mono text-neutral-400">Last 60 Minutes</span>
                  </div>
                  <div className="h-32 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-end p-3 space-x-1.5">
                    {[12, 14, 15, 13, 16, 18, 45, 85, 92, 96, 94, 88, 70, 42, 20, 15].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-full">
                        <div
                          className={`w-full rounded-t ${i >= 6 && i <= 11 ? 'bg-terracotta-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar Mockup */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
                  <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    Incident Metadata
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-neutral-500">Service:</span><span className="font-semibold">Payment API</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Environment:</span><span className="font-semibold">Production</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Assignee:</span><span className="font-semibold">Vishal (DevOps)</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Duration:</span><span className="font-mono font-semibold">32m 14s</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
                  <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 block border-b border-neutral-200 dark:border-neutral-800 pb-2">
                    Correlated Deployment
                  </span>
                  <div className="text-xs space-y-1">
                    <p className="font-mono font-semibold">payment-api v2.8.4</p>
                    <p className="text-neutral-500 text-[11px]">Deployed 2 minutes before incident start by ci-cd-bot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES SECTION */}
      <section id="platform" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold text-terracotta-500 uppercase tracking-wider">Engineered for SREs</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            One operational workspace for incident response.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            OpsAI turns fragmented monitoring telemetry into structured, evidence-backed root cause diagnoses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Alert Correlation</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Group thousands of metric threshold breaches into single, high-fidelity incident groups across a 10-minute window.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-terracotta-500">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">AI Root Cause Analysis</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Correlate commits, deployments, and trace anomalies to generate explicit root cause evidence and mitigation steps.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Incident Timeline</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Reconstruct precise chronological events from initial alert trigger to resolution and state transitions.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Postmortem Intelligence</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Generate editable postmortems with human-in-the-loop review ready for engineering post-incident reviews.
            </p>
          </div>
        </div>
      </section>

      {/* INCIDENT WORKFLOW DIAGRAM */}
      <section id="workflow" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold text-terracotta-500 uppercase tracking-wider">Lifecycle Automation</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            End-to-end incident lifecycle flow.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: '01', title: 'Alert', desc: 'Datadog / Webhook' },
            { step: '02', title: 'Correlation', desc: '10m Time-Window' },
            { step: '03', title: 'Incident', desc: 'State Machine' },
            { step: '04', title: 'AI Analysis', desc: 'BullMQ Async Queue' },
            { step: '05', title: 'Mitigation', desc: 'Engineer Action' },
            { step: '06', title: 'Resolution', desc: 'MTTR Calculation' },
            { step: '07', title: 'Postmortem', desc: 'Human-in-the-Loop' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-terracotta-500 block">{item.step}</span>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{item.title}</h4>
              <p className="text-[10px] text-neutral-500 font-mono">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST & RESPONSIBLE AI SECTION */}
      <section id="security" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-semibold text-terracotta-500 uppercase tracking-wider">Responsible AI Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              AI assists the investigation. Engineers remain in authority.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              OpsAI is engineered with strict state machine boundaries and explicit separation of confirmed evidence from AI hypotheses. Human engineers validate all status transitions and postmortem publications.
            </p>
            <div className="space-y-2 pt-2 text-xs font-medium">
              <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span>Explicit separation of confirmed evidence vs AI hypotheses</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span>Backend-enforced state machine preventing illegal status jumps</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span>Cryptographically traceable immutable system audit trail</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-dark-surface border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-100">Enterprise Compliance & Auditing</span>
              <ShieldCheck className="w-4 h-4 text-terracotta-500" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Role-Based Access Control (RBAC)</span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Separate permissions for Engineer, Incident Manager, and System Admin roles.</p>
              </div>
              <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">Deterministic Fallback Engine</span>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Automatic heuristic fallback ensures 100% availability if AI APIs are unreachable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 py-12 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-terracotta-500 text-white flex items-center justify-center font-mono font-bold text-[10px]">
              <Activity className="w-3 h-3" />
            </div>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">OpsAI</span>
            <span>&copy; 2026 Incident Intelligence Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-neutral-600 dark:text-neutral-400">
            <Link href="/login" className="hover:text-neutral-900 dark:hover:text-neutral-100">Sign In</Link>
            <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-neutral-100">Console</Link>
            <span className="font-mono text-[10px]">SOC2 Type II Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
