//components
//side panel:
//StoreName
//dashboard, products, logs, order history, settings

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex-1">{children}</main>;
}
