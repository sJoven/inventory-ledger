import { CheckCircle2 } from "lucide-react";

export default function EngineeringHighlights() {
  const highlights = [
    "Designed the application architecture",
    "Developed reusable React components",
    "Implemented Google OAuth authentication",
    "Built Role-Based Access Control (RBAC)",
    "Developed the analytics dashboard",
    "Built the inventory management system",
    "Designed the audit logging system",
    "Implemented rollback functionality",
    "Created an automated testing suite",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Project Summary
        </span>

        <h2 className="mt-4 text-4xl font-bold text-white">
          Engineering Highlights
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          As the sole developer of this project, I was responsible for the
          complete software development lifecycle—from system architecture and
          implementation to testing and deployment.
        </p>
      </div>

      <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-800/50 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {highlights.map((highlight) => (
            <div
              key={highlight}
              className="flex items-start gap-4 rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 transition hover:border-emerald-500/40"
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />

              <p className="text-slate-300">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
