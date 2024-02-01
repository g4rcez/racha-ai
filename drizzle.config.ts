import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/**/*.ts",
  driver: "pg",
  out: "./migrations",
  verbose: true,
  strict: true,
  dbCredentials: { connectionString: process.env.LOCAL_DATABASE ?? "" },
});
