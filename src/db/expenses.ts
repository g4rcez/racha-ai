import {
  decimal,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const expenses = pgTable("user", {
  id: uuid("id").notNull().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  lastUpdatedAt: timestamp("lastUpdatedAt"),
  total: decimal("total").notNull(),
  type: varchar("type", { length: 16 }),
  category: varchar("category", { length: 64 }),
  currencyCode: varchar("currencyCode", { length: 8 }),
  ownerId: uuid("ownerId"),
  products: jsonb("products").notNull().default({}),
});
