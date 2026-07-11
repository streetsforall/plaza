import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/mailto/login',
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
        if (credentials.password === process.env.LOGIN) {
          return { id: '' };
        }
        return null;
      },
    }),
  ],
});
