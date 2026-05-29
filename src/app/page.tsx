//use isLoggedIn
//a simple 2 link page with go to front store and go to admin page links
//using next links

import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>

      <div>
        <h2 className="font-semibold text-lg">User Details</h2>
        <p>User ID: {session.user.userid}</p>
        <p>Email: {session.user.email}</p>
      </div>

      <div>
        <h2 className="font-semibold text-lg">Client Access (is_client)</h2>
        {session.user.is_client.length > 0 ? (
          <ul className="list-disc pl-5 mt-2">
            {session.user.is_client.map((clientId) => (
              <li key={clientId}>{clientId}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No client access.</p>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg">Admin Permissions (is_admin)</h2>
        {session.user.is_admin.length > 0 ? (
          <ul className="list-disc pl-5 mt-2">
            {session.user.is_admin.map((admin) => (
              <li key={admin.store_id}>
                Store ID: <strong>{admin.store_id}</strong> — Role:{" "}
                <strong>{admin.role}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No admin permissions.</p>
        )}
      </div>
    </main>
  );
}
