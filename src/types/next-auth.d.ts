import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Define the shape of your admin array items
interface AdminPermission {
  store_id: string;
  role: string;
}

declare module "next-auth" {
  interface User {
    emailVerified?: Date | null;
  }
  interface Session {
    user: {
      userid: string;
      is_client: string[];
      is_admin: AdminPermission[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // Extend the default JWT interface
  interface JWT {
    userid: string;
    is_client: string[];
    is_admin: AdminPermission[];
  }
}
