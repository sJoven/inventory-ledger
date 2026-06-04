//use isLoggedIn
//a simple 2 link page with go to front store and go to admin page links
//1st btn will go to /client
//the other will go to /admin
//using next links
import { isLoggedIn } from "@/src/lib/isLoggedIn";
import { signOut } from "@/src/lib//auth";
import Link from "next/link";
import { adminAccess } from "@/src/lib/access";
import {
  canAdmin,
  canClient,
  canShowAdmin,
  canShowClient,
} from "@/src/lib/canUser";
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await isLoggedIn();
  const accessData = await adminAccess();
  const canAdminTest = await canAdmin(
    "6a0127d3e02491fe8773dd35",
    "view_reports",
  );
  const canClientTest = await canClient("6a0127d3e02491fe8773dd35");
  const canShowAdminTest = await canShowAdmin(
    "6a0127d3e02491fe8773dd35",
    "view_reports",
  );
  const canShowClientTest = await canShowClient("6a0127d3e02491fe8773dd35");

  console.log("canAdmin", { canAdminTest });
  console.log("canClient", { canClientTest });
  console.log("canShowAdmin", { canShowAdminTest });
  console.log("canShowClient", { canShowClientTest });

  return (
    <>
      <main className="p-8 flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Header with Profile Picture and Name */}
        <div className="flex items-center gap-4">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={`${session.user.name}'s Profile`}
              className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
            />
          )}
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        </div>

        {/* General Details */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg border-b pb-2 mb-3">
            User Details
          </h2>
          <div className="space-y-1 text-gray-700">
            <p>
              <span className="font-medium text-gray-900">User ID:</span>{" "}
              {session.user.userid}
            </p>
            <p>
              <span className="font-medium text-gray-900">Email:</span>{" "}
              {session.user.email}
            </p>
            <p>
              <span className="font-medium text-gray-900">
                Session Expires:
              </span>{" "}
              {new Date(session.expires).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Client Access */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg border-b pb-2 mb-3">
            Client Access (is_client)
          </h2>
          {session.user.is_client && session.user.is_client.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {session.user.is_client.map((clientId: string) => (
                <li key={clientId}>{clientId}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No client access.</p>
          )}
        </div>

        {/* Admin Permissions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg border-b pb-2 mb-3">
            Admin Permissions (is_admin)
          </h2>
          {session.user.is_admin && session.user.is_admin.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {session.user.is_admin.map((admin: any) => (
                <li key={admin.store_id}>
                  Store ID:{" "}
                  <span className="font-medium">{admin.store_id}</span> — Role:{" "}
                  <span className="font-medium">{admin.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No admin permissions.</p>
          )}
        </div>

        {/* Raw Session Dump for Debugging */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg text-white border-b border-gray-600 pb-2 mb-3">
            Raw Session Data
          </h2>
          <pre className="overflow-x-auto text-sm text-green-400">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </form>
        </div>
      </main>
      <main className="p-8 flex flex-col items-center justify-center min-h-screen gap-8">
        <h1 className="text-3xl font-bold">Select Your Destination</h1>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            href="/client"
            className="px-6 py-3 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Go to Front Store
          </Link>

          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-800 text-white text-center font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
          >
            Go to Admin Page
          </Link>
        </div>
      </main>
      <main>
        <div className="p-8 max-w-3xl mx-auto font-sans">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              🔍 `adminAccess()` Diagnostic Page
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Displays the raw array returned from your database permissions
              check.
            </p>
          </header>

          {/* Raw JSON Dump Container */}
          <div className="bg-gray-950 text-emerald-400 p-6 rounded-lg shadow-inner border border-gray-800 overflow-x-auto">
            <div className="text-xs text-gray-500 font-mono mb-3 uppercase tracking-wider select-none">
              // Array Output ({accessData.length} item
              {accessData.length === 1 ? "" : "s"})
            </div>

            {accessData.length === 0 ? (
              <span className="text-amber-400 font-mono text-sm">
                [] // Empty array. No active permissions found or user is not
                logged in.
              </span>
            ) : (
              <pre className="text-sm font-mono leading-relaxed">
                {JSON.stringify(accessData, null, 2)}
              </pre>
            )}
          </div>

          {/* Quick Visual Checklist */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-700">
              Expected Object Keys inside the array:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 font-mono text-[11px]">
              <li>
                <span className="text-purple-600">store_id</span> (String)
              </li>
              <li>
                <span className="text-purple-600">store_name</span> (String -
                fetched via relation)
              </li>
              <li>
                <span className="text-purple-600">role</span> (String)
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
