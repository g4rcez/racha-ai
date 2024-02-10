import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { db } from "~/db";
import { Env } from "~/lib/Env";

export default NextAuth({
  adapter: DrizzleAdapter(db) as any,
  providers: [GithubProvider(Env.github)],
});
