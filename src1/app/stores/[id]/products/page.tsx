import { notFound, redirect } from "next/navigation";
import { getStoreAccess } from "@/src/lib/access";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StoreDashboard({ params }: PageProps) {
  const { id } = await params;
  const access = await getStoreAccess(id);

  if (!access.authorized) {
    if (access.status === 401) redirect("/login");
    if (access.status === 404) notFound();
    //403
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

  //store model
  const { store } = access;
  console.log(store.store_name);
}
