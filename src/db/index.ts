import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Env } from "~/lib/Env";

const queryClient = postgres(Env.localDatabase);

export const db = drizzle(queryClient);
