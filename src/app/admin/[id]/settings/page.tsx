import { getStoreSettings } from "@/src/app/admin/[id]/settings/actions";
import SettingsForm from "@/src/app/admin/[id]/settings/settings-form";
import UserManagementForm from "@/src/app/admin/[id]/settings/user-management-form";
import { notFound, redirect } from "next/navigation";
import { canShowAdmin } from "@/src/lib/canUser";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>; // 1. Type it as a Promise
}) {
  const resolvedParams = await params;
  const storeId = resolvedParams.id;

  const canShowSetting = await canShowAdmin(storeId, "setting");

  if (canShowSetting.status !== 200) {
    redirect("/admin");
  }

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
      <section className="w-full space-y-6 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-1 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Store Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your store configuration and operational preferences.
          </p>
        </div>
        <SettingsForm storeId={storeId} initialData={initialData} />
      </section>

      <hr className="border-gray-200" />

      {/* User Management Section */}
      <section className="w-full space-y-6 px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-1 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            User Management
          </h2>{" "}
        </div>
        <UserManagementForm storeId={storeId} />
      </section>
    </div>
  );
}
