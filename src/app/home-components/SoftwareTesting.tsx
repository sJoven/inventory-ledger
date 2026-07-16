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
                  d="M12 3v18M3 21h18M6 15h12M9 9h6"
                />
              </svg>
            </div>

            <h4 className="text-xl font-semibold text-white">
              Testing Pyramid Illustration
            </h4>

            <p className="mt-2 text-slate-500">
              Replace this placeholder with your testing pyramid diagram.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
