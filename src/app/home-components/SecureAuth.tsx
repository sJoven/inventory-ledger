import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function SecureAuth() {
  const features = [
    "Google OAuth authentication",
    "Protected routes",
    "Permission-based dashboards",
    "Role-based member management",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Content */}
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={28} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Secure Authentication & Role Management
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Implemented secure authentication using Google OAuth 2.0 with a
            granular Role-Based Access Control (RBAC) system.
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
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Screenshot */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-xl">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-lg font-semibold text-white">
                Login Page
              </div>

              <p className="text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
