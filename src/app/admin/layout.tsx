import Navbar from "@/src/app/components/Navbar";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { SidebarProvider } from "@/src/app/components/SidebarContext";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await isLoggedIn();
  const user = { name: session.user.name, picture: session.user.image };

  return (
    <SidebarProvider>
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
