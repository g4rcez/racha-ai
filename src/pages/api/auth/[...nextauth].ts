import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/db";

const credentials = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
};

export default NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GithubProvider(credentials),
    AppleProvider(credentials),
    GoogleProvider(credentials),
  ],
});
