import { customAlphabet } from 'nanoid/async';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function authenticate(name: string) {
  // check against db
  return { user: { name }, token: name };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      //type: 'credentials',
      name: 'credentials',
      credentials: { name: {} },
      async authorize(credentials, req) {
        if (typeof credentials !== 'undefined') {
          const { name } = credentials;
          const res = await authenticate(name);
          if (typeof res !== 'undefined') {
            console.log('credentials', credentials);

            const nanoid = customAlphabet('1234567890', 10);
            const id = await nanoid();

            return {
              id,
              name,
              email: `${name}@gameroom.com`,
              image: id, // hack to store id
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    redirect() {
      return '/';
    },
  },
};
