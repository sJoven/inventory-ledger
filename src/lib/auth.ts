import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/src/lib/prisma";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  events: {
    async createUser({ user }) {
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
          },
        });
      }
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.image || !user.emailVerified || !user.name) {
          if (user.email) {
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
            });

            if (existingUser) {
              await prisma.user.update({
                where: { email: user.email },
                data: {
                  name: existingUser.name || profile?.name,
                  image: existingUser.image || profile?.picture,
                  emailVerified: existingUser.emailVerified || new Date(),
                },
              });
            }
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userid = user.id as string;
        token.picture = user.image;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { is_client: true, store_permissions: true },
        });

        token.is_client = dbUser?.is_client || [];
        token.is_admin =
          dbUser?.store_permissions
            ?.filter((sp) => sp.is_active === true)
            .map((sp) => ({
              store_id: sp.store_id,
              role: sp.role,
            })) || [];
      }

      if (trigger === "update" && token.userid) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userid as string },
          select: { is_client: true, store_permissions: true, image: true },
        });

        if (dbUser) {
          token.is_client = dbUser.is_client || [];
          token.is_admin =
            dbUser.store_permissions
              ?.filter((sp) => sp.is_active === true)
              .map((sp) => ({
                store_id: sp.store_id,
                role: sp.role,
              })) || [];
          if (dbUser.image) token.picture = dbUser.image;
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

        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
});
