import { auth, signIn } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/products");
  } else {
    redirect("/login");
  }
}
