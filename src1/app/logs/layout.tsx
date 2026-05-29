import Navbar from "@/src/components/Navbar";
import "@/src/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="lg:pl-64 p-4 md:p-8">{children}</main>
    </div>
  );
}
