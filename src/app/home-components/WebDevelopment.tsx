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

      {/* Architecture Diagram Placeholder */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
        <div className="flex aspect-[16/9] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
            </div>

            <h4 className="text-xl font-semibold text-white">
              Architecture Diagram
            </h4>

            <p className="mt-2 text-slate-500">
              Replace this placeholder with your system architecture image.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
