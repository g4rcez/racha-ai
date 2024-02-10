import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/**/*.ts",
  driver: "pg",
  out: "./migrations",
  verbose: true,
  strict: true,
  introspect: { casing: "preserve" },
  dbCredentials: { connectionString: process.env.LOCAL_DATABASE ?? "" },
});
