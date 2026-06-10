import { getStoreSettings } from "@/src/app/admin/[id]/settings/actions";
import SettingsForm from "@/src/app/admin/[id]/settings/settings-form";
import UserManagementForm from "@/src/app/admin/[id]/settings/user-management-form";
import { notFound } from "next/navigation";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>; // 1. Type it as a Promise
}) {
  // 2. Await the params before accessing properties
  const resolvedParams = await params;
  const storeId = resolvedParams.id;

  // Fetch initial data on the server
  const result = await getStoreSettings(storeId);

  // If the store doesn't exist or fetch fails, show a 404
  if (!result.success || !result.data) {
    notFound();
  }

  // Transform the raw database response into a flat object for the form
  const initialData = {
    store_name: result.data.store_name,
    store_icon: result.data.settings?.store_icon || "",
    low_stock_threshold: result.data.settings?.low_stock_threshold || 10,
    currency: result.data.settings?.currency || "PHP",
    theme: result.data.settings?.theme || "light",
    allow_negative_inventory:
      result.data.settings?.allow_negative_inventory || false,
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* General Settings Section */}
      <section>
        <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
        <SettingsForm storeId={storeId} initialData={initialData} />
      </section>

      <hr className="border-gray-200" />

      {/* User Management Section */}
      <section>
        <h2 className="text-xl font-bold mb-6">User Management</h2>
        <UserManagementForm storeId={storeId} />
      </section>
    </div>
  );
}
