import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDashboard({ params }: PageProps) {
  const [{ id }, session] = await Promise.all([params, auth()]);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [store, dbUser] = await Promise.all([
    prisma.store.findUnique({ where: { id } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, store_permissions: true },
    }),
  ]);

  if (!store) return notFound();

  const userPermission = dbUser?.store_permissions.find(
    (p) => p.store_id === id,
  );
  const isOwner = store.owner_id === session.user.id;

  if (!isOwner && !userPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this store.
        </p>
        <Link
          href="/stores"
          className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
        >
          Return to your stores
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">
            {store.store_name}
          </h1>
          <p className="text-slate-400 text-xs mt-2 font-mono uppercase tracking-widest">
            Store ID: {store.id}
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                Current User
              </h2>
              <p className="text-lg font-medium text-gray-900">
                {dbUser?.name || "Unknown User"}
              </p>
            </section>

            <section>
              <h2 className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                Your Access Level
              </h2>
              <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold capitalize">
                {isOwner ? "Store Owner" : userPermission?.role || "Staff"}
              </span>
            </section>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link
              href="/stores"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <span>←</span> Back to Store List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
