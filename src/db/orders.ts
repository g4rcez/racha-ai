import { relations } from "drizzle-orm";
import {
  decimal,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "~/db/users";

export const orders = pgTable("orders", {
  id: uuid("id").notNull().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  lastUpdatedAt: timestamp("lastUpdatedAt"),
  total: decimal("total").notNull(),
  type: varchar("type", { length: 16 }),
  category: varchar("category", { length: 32 }),
  status: varchar("status", { length: 32 }),
  currencyCode: varchar("currencyCode", { length: 8 }),
  metadata: jsonb("metadata").default({}),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
});

export const orderItems = pgTable("orderItems", {
  id: uuid("id").notNull().primaryKey(),
  productId: uuid("productId").notNull(),
  splitType: varchar("splitType", { length: 16 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  category: varchar("category", { length: 32 }),
  orderId: uuid("orderId")
    .notNull()
    .references(() => orders.id),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
  type: varchar("type", { length: 32 }),
  price: decimal("price").notNull().default("0"),
  quantity: decimal("quantity").notNull().default("1"),
  total: decimal("total").notNull().default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").notNull().primaryKey(),
  status: varchar("status", { length: 32 }),
  orderId: uuid("orderId")
    .notNull()
    .references(() => orders.id),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount").notNull().default("0"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  users: one(users, { fields: [payments.orderId], references: [users.id] }),
  orders: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const productRelations = relations(orderItems, ({ one }) => ({
  orders: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const orderRelations = relations(orders, ({ many }) => ({
  payments: many(payments),
  orderItems: many(orderItems),
}));
