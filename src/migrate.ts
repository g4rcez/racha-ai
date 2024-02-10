import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, dbConnection } from "~/db"; // This will run migrations on the database, skipping the ones already applied

async function main() {
  await migrate(db, { migrationsFolder: "./db" });
  await dbConnection.end();
}

main();
