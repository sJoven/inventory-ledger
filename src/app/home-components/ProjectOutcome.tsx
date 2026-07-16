import { CheckCircle2 } from "lucide-react";

export default function ProjectOutcome() {
  const development = [
    "Enterprise architecture",
    "Secure authentication",
    "Role-Based Access Control (RBAC)",
    "Analytics dashboard",
    "Multi-tenant support",
    "Audit logging",
  ];

  const testing = [
    "Unit testing",
    "Integration testing",
    "End-to-end automation",
    "Performance testing",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Testing Summary */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Quality Assurance
        </span>

        <h2 className="mt-4 text-4xl font-bold text-white">Testing Summary</h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          The project uses multiple testing strategies to validate business
          logic, service integration, complete user workflows, and application
          performance.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Test Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Tool
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Purpose
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800 bg-slate-900">
            <tr>
              <td className="px-6 py-4 text-slate-300">Unit</td>
              <td className="px-6 py-4 text-emerald-400 font-medium">Vitest</td>
              <td className="px-6 py-4 text-slate-400">Business Logic</td>
            </tr>

            <tr>
              <td className="px-6 py-4 text-slate-300">Integration</td>
              <td className="px-6 py-4 text-emerald-400 font-medium">Vitest</td>
              <td className="px-6 py-4 text-slate-400">Database & Services</td>
            </tr>

            <tr>
              <td className="px-6 py-4 text-slate-300">End-to-End</td>
              <td className="px-6 py-4 text-emerald-400 font-medium">
                Playwright
              </td>
              <td className="px-6 py-4 text-slate-400">User Workflows</td>
            </tr>

            <tr>
              <td className="px-6 py-4 text-slate-300">Performance</td>
              <td className="px-6 py-4 text-emerald-400 font-medium">k6</td>
              <td className="px-6 py-4 text-slate-400">Scalability & Load</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Project Outcome */}
      <div className="mt-24 text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Conclusion
        </span>

        <h2 className="mt-4 text-4xl font-bold text-white">Project Outcome</h2>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-400">
          The project demonstrates both software engineering and quality
          assurance practices by combining secure application architecture with
          comprehensive automated testing. It highlights the development of a
          production-ready commerce platform supported by a reliable and
          scalable testing strategy.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {/* Development */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8">
          <h3 className="mb-8 text-2xl font-semibold text-white">
            Development
          </h3>

          <ul className="space-y-4">
            {development.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testing */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8">
          <h3 className="mb-8 text-2xl font-semibold text-white">Testing</h3>

          <ul className="space-y-4">
            {testing.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
