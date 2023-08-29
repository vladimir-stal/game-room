import { NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { db } from './db';
//import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetchRedis } from '@/helpers/redis';

// function getGoogleCredentials() {
//   const clientId = process.env.GOOGLE_CLIENT_ID
//   const clientSecret = process.env.GOOGLE_CLIENT_SECRET

//   if (!clientId || clientId.length === 0) {
//     throw new Error('Missing GOOGLE_CLIENT_ID')
//   }

//   if (!clientSecret || clientSecret.length === 0) {
//     throw new Error('Missing GOOGLE_CLIENT_SECRET')
//   }

//   return { clientId, clientSecret }
// }

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
  providers: [
    // GoogleProvider({
    //   clientId: getGoogleCredentials().clientId,
    //   clientSecret: getGoogleCredentials().clientSecret,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Vova' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: '1', name: 'J Smith', email: 'jsmith@example.com' };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
      // async authorize (credentials, req) {
      //   if (typeof credentials !== "undefined") {
      //     const res = await authenticate(credentials.username, credentials.password)
      //     if (typeof res !== "undefined") {
      //       return { ...res.user, apiToken: res.token }
      //     } else {
      //       return null
      //     }
      //   } else {
      //     return null
      //   }
      // }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id;
        }

        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
      };
    },
    async session({ session, token }) {
      if (token && session.user) {
        //session.user.id = token.id;
        //session.user.name = token.name;
      }

      return session;
    },
    redirect() {
      return '/dashboard';
    },
  },
};
