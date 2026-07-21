import Image from "next/image";

export default function WebDevelopment() {
  return (
    <section id="web-development" className="mx-auto max-w-7xl px-6 py-24">
      {/* Section Label */}
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
        Web Development
      </span>

      {/* Title */}
      <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
        Enterprise Headless Commerce SaaS
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        A production-grade multi-tenant administrative dashboard built using
        Next.js and React that enables secure inventory management, analytics,
        user administration, and operational control.
      </p>

      {/* Divider */}
      <div className="my-16 h-px bg-slate-800" />

      {/* Architecture Overview */}
      <div className="max-w-4xl">
        <h3 className="text-3xl font-semibold text-white">
          Architecture Overview
        </h3>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          The platform was designed around enterprise software principles,
          emphasizing security, auditability, scalability, and maintainability.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
        <Image
          src="/web-architecture.png"
          alt="Enterprise Headless Commerce SaaS Architecture Diagram"
          width={6510}
          height={4380}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
