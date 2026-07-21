import { CheckCircle2, Store } from "lucide-react";
import Image from "next/image";

export default function MultiTenantStore() {
  const features = [
    "Store switching",
    "Theme customization",
    "Currency settings",
    "Store-specific inventory",
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Content */}
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Store size={28} />
          </div>

          <h2 className="text-3xl font-bold text-white">
            Multi-Tenant Store Management
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Supports multiple stores while maintaining strict data isolation,
            allowing administrators to manage independent storefronts with
            dedicated settings, inventory, and branding from a single platform.
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

        {/* Screenshot */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/settings-page.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1583}
            height={1188}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
