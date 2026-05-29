import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateStoreButton from "./components/CreateStoreButton";

export default async function StoresPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { store_permissions: true },
  });
  const permissions = dbUser?.store_permissions || [];
  const storeIds = permissions.map((p) => p.store_id);

  const stores = await prisma.store.findMany({
    where: {
      id: { in: storeIds },
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Stores</h1>
        <CreateStoreButton />
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-gray-500">
            You don't have access to any stores yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => {
            const userPermission = permissions.find(
              (p: any) => p.store_id === store.id,
            );

            return (
              <div
                key={store.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold">{store.store_name}</h2>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                    {userPermission?.role || "Member"}
                  </span>

                  <Link
                    href={`/stores/${store.id}`}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center"
                  >
                    Enter Store →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
