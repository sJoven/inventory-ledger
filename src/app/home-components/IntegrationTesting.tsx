import { Blocks, CheckCircle2 } from "lucide-react";

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

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                Add Member Test
              </h4>

              <p className="mt-2 text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Rollback */}
      <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
        <div className="order-2 lg:order-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                Rollback Test
              </h4>

              <p className="mt-2 text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
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

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                Product Update Test
              </h4>

              <p className="mt-2 text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
