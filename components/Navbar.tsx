import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import UserMenu from "@/components/UserMenu";
import Sidebar from "@/components/Sidebar";

export default async function Navbar() {
  const session = await auth();
  if (!session?.user) return null;

  let storeName = "No Store Assigned";
  if ((session.user as any).store_id) {
    const store = await prisma.store.findUnique({
      where: { id: (session.user as any).store_id },
      select: { store_name: true },
    });
    storeName = store?.store_name || storeName;
  }

  return (
    <>
      <Sidebar storeName={storeName} userName={session.user.name} />

      <header className="flex items-center justify-end px-4 md:px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-30 lg:ml-64">
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-gray-700 font-medium">
            {session.user.name}
          </span>
          <UserMenu user={session.user} />
        </div>
      </header>
    </>
  );
}
