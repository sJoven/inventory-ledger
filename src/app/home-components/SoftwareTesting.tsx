import Image from "next/image";

export default function SoftwareTesting() {
  return (
    <section id="software-testing" className="mx-auto max-w-7xl px-6 py-24">
      {/* Section Label */}
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
        Software Testing
      </span>

      {/* Title */}
      <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
        Quality Assurance Strategy
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        To improve software reliability, I developed an automated testing
        strategy that validates business logic, application workflows, and
        application performance across multiple testing levels.
      </p>

      {/* Divider */}
      <div className="my-16 h-px bg-slate-800" />

      {/* Testing Pyramid */}
      <div className="max-w-4xl">
        <h3 className="text-3xl font-semibold text-white">Testing Pyramid</h3>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          The testing strategy follows a layered approach, beginning with unit
          tests for isolated business logic, integration tests for service
          interactions, end-to-end tests for complete user workflows, and
          performance testing to evaluate scalability under load.
        </p>
      </div>

      {/* Illustration Placeholder */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
        <Image
          src="/testing.png"
          alt="Enterprise Headless Commerce SaaS Architecture Diagram"
          width={4736}
          height={2099}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
