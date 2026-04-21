import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  let storeName = "No Store Assigned";
  if ((session.user as any).store_id) {
    const store = await prisma.store.findUnique({
      where: { id: (session.user as any).store_id },
      select: { store_name: true },
    });
    storeName = store?.store_name || storeName;
  }

  const firstName = session.user.name?.split(" ")[0];

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <img
        src={session.user.image || ""}
        alt="Profile"
        referrerPolicy="no-referrer"
        className="w-20 h-20 rounded-full border"
      />
      <h1 className="text-xl">Hello, {firstName}!</h1>
      <p className="font-bold text-green-600">Store: {storeName}</p>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
