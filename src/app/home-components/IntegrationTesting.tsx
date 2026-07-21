import { Blocks, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function IntegrationTesting() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Blocks size={28} />
        </div>

        <h2 className="text-4xl font-bold text-white">Integration Testing</h2>

        <p className="mt-6 text-lg leading-8 text-slate-400">
          Verified multiple components working together to ensure application
          services, authentication, database operations, and business logic
          interact correctly.
        </p>
      </div>

      {/* Add New Member */}
      <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold text-white">Add New Member</h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Ensured member creation correctly updates authentication, assigned
            roles, and database records while maintaining data consistency
            across the application.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/addMember.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1170}
            height={475}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      {/* Product Rollback */}
      <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/revert.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1164}
            height={437}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        <div className="order-1 lg:order-2">
          <h3 className="text-2xl font-semibold text-white">
            Product Rollback
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Verified that reverting an action restores the exact previous
            product state, ensuring data integrity and reliable recovery from
            unintended changes.
          </p>

          <ul className="mt-8 space-y-3">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Previous product data restored
            </li>

            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Inventory consistency maintained
            </li>
          </ul>
        </div>
      </div>

      {/* Product Update */}
      <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold text-white">Product Update</h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Validated successful product updates across application services and
            the persistence layer, ensuring modifications are accurately
            reflected throughout the system.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50 shadow-lg">
          <Image
            src="/update.png"
            alt="Enterprise Headless Commerce SaaS Architecture Diagram"
            width={1086}
            height={483}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
