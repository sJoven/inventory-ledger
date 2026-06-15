import Sidebar from "@/src/app/components/Sidebar";
import { adminAccess } from "@/src/lib/access";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const permRoles = await adminAccess();
  const currentStoreAccess = permRoles.find((perm) => perm.store_id === id);

  const userRole = currentStoreAccess?.role;

  if (!userRole) {
    redirect("/admin");
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar role={userRole} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
