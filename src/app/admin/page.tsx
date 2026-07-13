import Link from "next/link";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { redirect } from "next/navigation";
import { adminAccess } from "@/src/lib/access";
import { getPendingInvitations } from "@/src/lib/invitations";
import { acceptInvite, declineInvite } from "@/src/app/admin/actions";
import CreateStoreModal from "@/src/app/admin/create-store-modal";
interface Store {
  store_id: string;
  store_name: string;
  role: string;
}

export default async function AdminDashboard() {
  const session = await isLoggedIn();
  if (!session) {
    redirect(`/login`);
  }
  const userid = session.user.userid as string;

  const stores: Store[] = await adminAccess();
  const invitations: Store[] = await getPendingInvitations();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Manage your accessible stores and pending team invitations.
          </p>
        </div>

        <div className="shrink-0">
          <CreateStoreModal />
        </div>
      </div>

      <div className="space-y-12">
        {/* Stores Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              🏪 Your Stores
            </h2>
            <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
              {stores.length}
            </span>
          </div>

          {stores.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50">
              <p className="text-gray-500 font-medium">
                You don't have access to any stores yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <StoreCard key={store.store_id} store={store} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              ✉️ Pending Invitations
            </h2>
            {invitations.length > 0 ? (
              <span className="text-xs bg-orange-50 border border-orange-100 text-[#fc6022] px-2.5 py-1 rounded-full font-bold">
                {invitations.length} New
              </span>
            ) : (
              <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                0
              </span>
            )}
          </div>

          {invitations.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50">
              <p className="text-gray-500 font-medium">
                You have no pending invitations at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((invite) => (
                <InviteCard
                  key={invite.store_id}
                  invite={invite}
                  userId={userid}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function StoreCard({ store }: { store: Store }) {
  const roleColors: Record<string, string> = {
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    manager: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const role = store.role === "super" ? "admin" : store.role;
  const normalizedRole = store.role.toLowerCase();
  const badgeStyle =
    roleColors[normalizedRole] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <Link
      href={`/admin/${store.store_id}`}
      className="group block p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#fc6022]/40 transition-all duration-200"
    >
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-lg font-bold text-[#0f172a] tracking-tight group-hover:text-[#fc6022] transition-colors duration-200 truncate">
              {store.store_name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border shrink-0 ${badgeStyle}`}
            >
              {role}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="truncate flex items-center gap-1">
            <span className="text-slate-400">ID:</span> {store.store_id}
          </span>
          <span className="text-[#fc6022] font-semibold group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1 font-sans shrink-0 ml-2">
            Manage <span>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function InviteCard({
  invite,
  userId,
}: {
  invite: Store;
  userId: string;
}) {
  const role = invite.role === "super" ? "admin" : invite.role;
  const acceptAction = acceptInvite.bind(null, userId, invite.store_id);
  const declineAction = declineInvite.bind(null, userId, invite.store_id);

  return (
    <div className="p-5 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-5">
      <div>
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-bold text-[#0f172a] tracking-tight truncate">
            {invite.store_name}
          </h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fc6022]/10 text-[#fc6022] text-[11px] font-bold tracking-wide shrink-0">
            As {role}
          </span>
        </div>
        <p className="mt-1.5 text-xs font-mono text-slate-400 truncate flex items-center gap-1">
          <span className="text-slate-400">ID:</span> {invite.store_id}
        </p>
      </div>

      <div className="flex gap-3 pt-3 border-t border-slate-100">
        <form action={acceptAction} className="flex-1">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#fc6022] hover:bg-[#e0541e] text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            Accept
          </button>
        </form>
        <form action={declineAction} className="flex-1">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-all duration-200 hover:text-[#0f172a] hover:border-slate-300 active:scale-[0.98] cursor-pointer"
          >
            Decline
          </button>
        </form>
      </div>
    </div>
  );
}
