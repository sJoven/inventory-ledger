import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";

export async function isLoggedIn() {
  const session = await auth();

  if (!session) {
    if (process.env.NODE_ENV !== "test") {
      redirect("/login");
    }
    return null;
  }

  return session;
}
