import { Activity, Gauge } from "lucide-react";

export default function PerformanceTesting() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
          <Gauge size={28} />
        </div>

        <h2 className="text-4xl font-bold text-white">Performance Testing</h2>

        <div className="mt-6 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-orange-400">
            Tool: k6
          </span>
        </div>

        <p className="mt-6 text-lg leading-8 text-slate-400">
          Measured application performance under concurrent usage to evaluate
          stability, responsiveness, and scalability under realistic workloads.
        </p>
      </div>

      {/* Product Creation Stress Test */}
      <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Product Creation Stress Test
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Evaluated application stability while continuously creating products
            under heavy concurrent load, ensuring the system remained responsive
            and reliable during peak usage.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                k6 Stress Graph
              </h4>

              <p className="mt-2 text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Search Load Test */}
      <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">
        <div className="order-2 lg:order-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/50">
          <div className="flex aspect-[16/10] items-center justify-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                k6 Search Results
              </h4>

              <p className="mt-2 text-slate-500">Screenshot Placeholder</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <h3 className="text-2xl font-semibold text-white">
            Product Search Load Test
          </h3>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Measured response times during concurrent product search requests to
            verify consistent performance and identify potential bottlenecks
            under increasing user traffic.
          </p>

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-orange-400" />

              <div>
                <h4 className="font-semibold text-white">
                  Performance Metrics
                </h4>

                <p className="mt-1 text-slate-400">
                  Response time, throughput, and system stability were monitored
                  throughout the load test execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
