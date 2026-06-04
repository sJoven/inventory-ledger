import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";

export async function isLoggedIn() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return session;
}
