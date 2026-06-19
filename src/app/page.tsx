import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BarChart3,
  RotateCcw,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Settings,
  ShoppingBag,
} from "lucide-react";

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Enterprise Headless Commerce SaaS
          </span>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 group"
        >
          Live Project
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Architecture Case Study
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4 mb-6">
          Enterprise-Ready Headless SaaS Commerce Infrastructure
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          A production-grade, multi-tenant B2B administrative dashboard
          engineered for total operational control, data auditability, and
          granular security.
        </p>
      </header>

      {/* CORE HIGHLIGHTS GRID */}
      <main className="max-w-5xl mx-auto px-6 pb-24 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-400 rounded-full" />
            Architectural Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg w-fit mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Granular RBAC & Secure Auth
              </h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Integrated secure Google OAuth 2.0 single sign-on (SSO).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Strict permission matrices isolating financial analytics and
                    system settings based on assigned member roles.
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-Time Operational Analytics
              </h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Dynamic filtering across day, week, and month granularities.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Time-series revenue line charting, low-stock threshold
                    triggers, and automated PDF report compilation.
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg w-fit mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Audit Trails & State Reversion
              </h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Active activity logging paired with an instantaneous state
                    rollback mechanism to undo accidental operational
                    modifications.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Strict read-only order history ledger to maintain financial
                    compliance and corporate integrity.
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg w-fit mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Multi-Tenant Governance
              </h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Store toggle allowing strict data isolation across
                    independent shop pipelines.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Granular inventory controls including global theme
                    variables, custom currencies, and strict negative-inventory
                    configuration toggles.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-800" />

        {/* SYSTEM CAPABILITIES SECTION */}
        <section className="bg-gradient-to-b from-slate-800/30 to-transparent border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            System Features Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <span>Product CRUD & Fast Search</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Multi-Currency Localization</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Delta Percentage Calculations</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
