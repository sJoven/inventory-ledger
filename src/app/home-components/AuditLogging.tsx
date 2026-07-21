import { CheckCircle2, History } from "lucide-react";
import Image from "next/image";

export default function AuditLogging() {
  const features = [
    "Immutable activity logs",
    "State restoration",
    "Rollback functionality",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Screenshot */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/logs-page.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1583}
            height={851}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <History size={28} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Audit Logging & Rollback
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Product actions performed within the system is securely recorded and
            can be reverted when necessary, providing accountability,
            traceability, and protection against accidental changes.
          </p>

          <div className="mt-10">
            <h3 className="mb-5 text-lg font-semibold text-white">Features</h3>

            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
