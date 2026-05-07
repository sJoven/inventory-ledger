import { auth, signIn } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/products");
  }

  return (
    <div
      className="relative min-h-screen bg-[#17212c] flex justify-center items-start pt-24 px-4"
      style={{
        backgroundImage: "url('/login-background-image.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#17212c]/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md bg-[#17212c] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-[#fc6022]" />

        <div className="p-10 text-center">
          <h1 className="text-[1rem] font-bold text-white mb-2 tracking-wide uppercase">
            Inventory Ledger
          </h1>
          <p className="text-[0.875rem] text-[#c5c5c5] mb-10 leading-relaxed">
            Manage your stock with precision.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/products" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#fc6022] text-white text-[0.875rem] font-bold rounded hover:bg-[#e2521a] transition-colors duration-200 shadow-lg"
            >
              <div className="bg-white p-1 rounded-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
