import { CheckCircle2, FlaskConical } from "lucide-react";
import Image from "next/image";

export default function UnitTesting() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <FlaskConical size={28} />
        </div>

        <h2 className="text-4xl font-bold text-white">Unit Testing</h2>

        <div className="mt-6 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-emerald-400">
            Tool: Vitest
          </span>
        </div>

        <p className="mt-6 text-lg leading-8 text-slate-400">
          Focused on validating isolated business logic to ensure individual
          functions behave correctly under various scenarios.
        </p>
      </div>

      {/* Revenue Growth */}
      <div className="my-16 grid items-center gap-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/calculate.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1091}
            height={517}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Revenue Growth Calculation
          </h3>

          <p className="mt-2 text-lg leading-8 text-slate-400">
            Verified revenue calculations and percentage growth across multiple
            scenarios to ensure financial metrics remained accurate.
          </p>
        </div>
      </div>

      {/* Action Log Formatter */}
      <div className="mt-16 grid items-center gap-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/readable.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1075}
            height={517}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div className="mt-2 order-1 lg:order-2">
          <h3 className="text-2xl font-semibold text-white">
            Action Log Formatter
          </h3>

          <p className="mt-2 text-lg leading-8 text-slate-400">
            Ensured audit log events are transformed into readable activity
            messages that clearly describe user actions.
          </p>

          <div className="mt-2 rounded-xl border border-slate-700 bg-slate-900 p-6">
            <p className="font-mono text-emerald-400">
              07-21-2026, 10:38 | update | Product ID
            </p>

            <p className="my-4 text-2xl text-slate-500">↓</p>

            <p className="text-slate-300">
              Updated <strong>Laptop V-Mx</strong> at July 21, 10: 38 AM
            </p>
          </div>
        </div>
      </div>

      {/* Store Name Validation */}
      <div className="mt-16 grid items-center gap-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/name.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={991}
            height={519}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Store Name Validation
          </h3>

          <p className="mt-2 text-lg leading-8 text-slate-400">
            Validated accepted and rejected store names to ensure only correctly
            formatted inputs are allowed.
          </p>

          <ul className="mt-2 space-y-3">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Valid store names accepted
            </li>

            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Invalid inputs rejected
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
