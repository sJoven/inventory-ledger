import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "admin",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      const storeA = await prisma.store.findFirst({
        where: { store_name: "Store A" },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "admin",
          emailVerified: new Date(),
          store_id: storeA?.id || null,
        },
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.picture = user.image;
        token.store_id = (user as any).store_id;
        if (!token.store_id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { store_id: true },
          });
          token.store_id = dbUser?.store_id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role;
        (session.user as any).store_id = token.store_id;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
