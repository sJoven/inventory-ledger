import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <span className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
          Portfolio Project
        </span>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
          Enterprise-Ready
          <br />
          Headless Commerce SaaS
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400 md:text-xl">
          A production-grade multi-tenant commerce platform designed with
          enterprise architecture, security, scalability, and automated quality
          assurance.
        </p>

        <a
          href="#web-development"
          className="group mt-14 inline-flex flex-col items-center gap-2 text-emerald-400 transition hover:text-emerald-300"
        >
          <span className="font-medium tracking-wide">Explore Project</span>

          <ArrowDown className="h-6 w-6 animate-bounce transition-transform group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
}
