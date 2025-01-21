import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import prisma from "./app/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      try {
        if (user.email) {
          const ifUserExists = await prisma.user.findUnique({
            where: {
              email: user.email
            }
          });
          if (!ifUserExists) {
            await prisma.user.create({
              data: {
                email: user.email
              }
            });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    }
  }
});