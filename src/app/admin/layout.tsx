import Navbar from "@/src/app/components/Navbar";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { SidebarProvider } from "@/src/app/components/SidebarContext";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await isLoggedIn();
  if (!session) {
    redirect(`/login`);
  }

  const user = { name: session.user.name, picture: session.user.image };

  return (
    <SidebarProvider>
      <Navbar user={user} />
      <main className="flex-1 bg-gray-200">{children}</main>
    </SidebarProvider>
  );
}
