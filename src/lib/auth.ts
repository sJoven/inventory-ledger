import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.image || !user.emailVerified) {
          if (!user.id) return true;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              image: user.image ?? (profile as any)?.picture,
              emailVerified: user.emailVerified ?? new Date(),
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.userid = user.id as string;

        const dbUser = await prisma.user.findUnique({
          where: { id: token.userid },
          select: { is_client: true, store_permissions: true },
        });

        token.is_client = dbUser?.is_client || [];
        token.is_admin =
          dbUser?.store_permissions?.map((sp) => ({
            store_id: sp.store_id,
            role: sp.role,
          })) || [];
      }

      if (trigger === "update" && token.userid) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userid as string },
          select: { is_client: true, store_permissions: true },
        });

        if (dbUser) {
          token.is_client = dbUser.is_client || [];
          token.is_admin =
            dbUser.store_permissions?.map((sp) => ({
              store_id: sp.store_id,
              role: sp.role,
            })) || [];
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.userid = token.userid as string;
        session.user.is_client = token.is_client as string[];
        session.user.is_admin = token.is_admin as {
          store_id: string;
          role: string;
        }[];
      }
      return session;
    },
  },
});
