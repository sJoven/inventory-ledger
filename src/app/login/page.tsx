import { signIn } from "@/src/lib/auth"; // Make sure this path matches your auth.ts file

export default function GoogleSignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </form>
  );
}
