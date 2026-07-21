import { CheckCircle2, MonitorPlay } from "lucide-react";
import Image from "next/image";

export default function EndToEndTesting() {
  const workflow = [
    "Login",
    "Create Product",
    "Verify Product",
    "Update Product",
    "Verify Changes",
    "Delete Product",
    "Verify Removal",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <MonitorPlay size={28} />
        </div>

        <h2 className="text-4xl font-bold text-white">End-to-End Testing</h2>

        <div className="mt-6 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-violet-400">
            Tool: Playwright
          </span>
        </div>

        <p className="mt-6 text-lg leading-8 text-slate-400">
          Validated complete user workflows to ensure the application behaves
          correctly from the user's perspective across authentication,
          navigation, and inventory management.
        </p>
      </div>

      {/* Authentication */}
      <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold text-white">Authentication</h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Automated user login using the NextAuth Credentials Provider,
            verifying authentication flow, session creation, and protected route
            access.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/login.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1208}
            height={608}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      {/* Product CRUD Flow */}
      <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/crud.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1427}
            height={622}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div className="order-1 lg:order-2">
          <h3 className="text-2xl font-semibold text-white">
            Product CRUD Flow
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Automated the complete product management workflow to validate core
            user interactions from creation through deletion.
          </p>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
            <h4 className="mb-4 text-lg font-semibold text-white">Workflow</h4>

            <ul className="space-y-3">
              {workflow.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
