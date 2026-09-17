import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/edit/login',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (credentials.password === AUTH_PASSWORD) {
          return { id: '' };
        }
        return null;
      },
    }),
  ],
});
