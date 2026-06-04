import Link from "next/link";
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { adminAccess } from "@/src/lib/access";
import { getPendingInvitations } from "@/src/lib/invitations";
import { acceptInvite, declineInvite } from "@/src/app/admin/actions";

interface Store {
  store_id: string;
  store_name: string;
  role: string;
}

export default async function AdminDashboard() {
  // 1. Check if the user is authenticated
  const loggedIn = await isLoggedIn();
  const userid = loggedIn.user.userid as string;

  // 2. Fetch the stores and pending invitations live from the database
  const stores: Store[] = await adminAccess();
  const invitations: Store[] = await getPendingInvitations();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your accessible stores and pending team invitations.
        </p>
      </div>

      {/* Main Grid Sections */}
      <div className="space-y-12">
        {/* Stores Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏪 Your Stores
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
              {stores.length}
            </span>
          </h2>

          {stores.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
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

        {/* Invitations Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✉️ Pending Invitations
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-normal">
              {invitations.length}
            </span>
          </h2>

          {invitations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
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

// Component 1: Store Card
function StoreCard({ store }: { store: Store }) {
  const roleColors: Record<string, string> = {
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    manager: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const normalizedRole = store.role.toLowerCase();
  const badgeStyle =
    roleColors[normalizedRole] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <Link
      href={`/admin/${store.store_id}`}
      className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex flex-col h-full justify-between space-y-4">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}
          >
            {store.role}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {store.store_name}
          </h3>
        </div>

        <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>ID: {store.store_id}</span>
          <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Manage <span>&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Component 2: Invite Card
export function InviteCard({
  invite,
  userId,
}: {
  invite: Store;
  userId: string;
}) {
  // .bind allows us to pass arguments to the Server Action
  // The first argument is 'this' (null), followed by the action's expected arguments.
  const acceptAction = acceptInvite.bind(null, userId, invite.store_id);
  const declineAction = declineInvite.bind(null, userId, invite.store_id);

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {invite.store_name}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium shrink-0">
            As {invite.role}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-mono text-gray-400 truncate">
          Store ID: {invite.store_id}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        {/* Wrap the Accept button in a form */}
        <form action={acceptAction} className="flex-1">
          <button
            type="submit"
            className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
          >
            Accept
          </button>
        </form>

        {/* Wrap the Decline button in a form */}
        <form action={declineAction} className="flex-1">
          <button
            type="submit"
            className="w-full px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md text-xs font-medium transition-colors"
          >
            Decline
          </button>
        </form>
      </div>
    </div>
  );
}
