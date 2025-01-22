import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import prisma from "./app/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log('Sign-in attempt:', {
          email: user.email,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId
        });

        if (!user.email) {
          console.error('No email provided in user object');
          return false;
        }

        // Try to find or create user without immediately failing
        try {
          const ifUserExists = await prisma.user.findUnique({
            where: {
              email: user.email
            }
          });

          if (!ifUserExists) {
            console.log('Creating new user:', user.email);
            await prisma.user.create({
              data: {
                email: user.email,
                id: user.id || undefined
              }
            });
          } else {
            console.log('Existing user found:', user.email);
          }
        } catch (dbError) {
          console.error('Database operation failed:', dbError);
        }

        return true;
      } catch (error) {
        console.error('Fatal error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    }
  }
});