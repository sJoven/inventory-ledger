export default function Technologies() {
  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "NextAuth",
    "Google OAuth",
    "Prisma",
    "PostgreSQL",
    "Vitest",
    "Playwright",
    "k6",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Technology Stack
        </span>

        <h2 className="mt-4 text-4xl font-bold text-white">Technologies</h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          Built with modern web technologies focused on scalability,
          maintainability, security, and automated testing.
        </p>
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-4">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-slate-700 bg-slate-800/70 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
