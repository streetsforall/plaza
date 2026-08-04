import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
        if (credentials.password === process.env.AUTH_PASSWORD) {
          return { id: '' };
        }
        return null;
      },
    }),
  ],
});
