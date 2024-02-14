import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Env } from "../lib/env";

export const dbConnection = postgres(Env.database);

export const db = drizzle(dbConnection);
