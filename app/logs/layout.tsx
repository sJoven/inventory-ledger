import Navbar from "@/components/Navbar";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* lg:pl-64 ensures that on desktop, the page content 
          is pushed to the right to make room for the sidebar.
      */}
      <main className="lg:pl-64 p-4 md:p-8">{children}</main>
    </div>
  );
}
