import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const secrets = pgTable("secrets", {
  id: uuid("id").notNull().primaryKey(),
  type: varchar("type", { length: 16 }).notNull(),
  secret: text("secret"),
  public: text("public"),
  createdBy: varchar("createdBy", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").notNull().primaryKey(),
    image: text("image"),
    name: varchar("name", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }),
    email: varchar("email", { length: 256 }).notNull().unique(),
    preferences: jsonb("preferences").default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    secretId: uuid("secretId").references(() => secrets.id),
  },
  (t) => ({ emailIndex: index("emailIndex").on(t.email) }),
);

export const usersFriends = pgTable(
  "usersFriends",
  {
    id: uuid("id").notNull().primaryKey(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    message: varchar("message", { length: 256 }).notNull().default(""),
    status: varchar("status", { length: 16 }).notNull(),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => users.id),
    invitedId: uuid("invitedId")
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    uniqueFriends: unique().on(t.ownerId, t.invitedId),
  }),
);

export const usersRelations = relations(users, (relation) => ({
  friends: relation.many(users),
}));

export const userGroupsRelations = relations(usersFriends, ({ one }) => ({
  friend: one(users, { fields: [usersFriends.id], references: [users.id] }),
  user: one(users, { fields: [usersFriends.id], references: [users.id] }),
}));
