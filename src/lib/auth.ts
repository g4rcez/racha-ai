import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { uuidv7 } from "@kripod/uuidv7";
import NextAuth, { NextAuthOptions } from "next-auth";
import { unstable_getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import { GetServerSidePropsContext } from "next/types";
import { db } from "~/db";
import { Env } from "~/lib/env";

export const nextAuthOptions: NextAuthOptions = {
  secret: "ULTRA SECRET",
  debug: true,
  adapter: DrizzleAdapter(db) as any,
  providers: [GithubProvider(Env.github)],
  session: { strategy: "jwt", generateSessionToken: uuidv7 },
  callbacks: {
    session: ({ session, token }) => {
      if (session.user) (session.user as any).id = token.sub;
      return session;
    },
  },
};

export const nextAuth = NextAuth(nextAuthOptions);

export const getSession = async (context: GetServerSidePropsContext) =>
  unstable_getServerSession(context.req, context.res, nextAuthOptions);
