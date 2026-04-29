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

      <header className="flex items-center justify-end px-4 md:px-8 py-4 bg-[#17212c] border-b border-white/5 shadow-md sticky top-0 z-30 lg:ml-64">
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[0.875rem] font-medium text-[#c5c5c5]">
            {session.user.name}
          </span>

          <div className="border-l border-white/10 pl-4">
            <UserMenu user={session.user} />
          </div>
        </div>
      </header>
    </>
  );
}
