import { notFound, redirect } from "next/navigation";
import { getStoreAccess } from "@/src/lib/access";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    notFound();
  }

  return (
    <div className="store-container">
      <main>{children}</main>
    </div>
  );
}
