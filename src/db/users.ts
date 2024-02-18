import { InferSelectModel, relations } from "drizzle-orm";
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

export const users = pgTable(
  "user",
  {
    id: uuid("id").notNull().primaryKey(),
    name: text("name"),
    image: text("image"),
    email: text("email").notNull().unique(),
    preferences: jsonb("preferences").default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
  },
  (t) => ({ emailIndex: index("emailIndex").on(t.email) }),
);

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().notNull(),
  avatar: text("avatar"),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 256 }),
  description: varchar("description", { length: 256 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  deletedAt: timestamp("deletedAt"),
});

export const userGroups = pgTable(
  "userGroups",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id),
    groupId: uuid("groupId")
      .notNull()
      .references(() => groups.id),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    deletedAt: timestamp("deletedAt"),
  },
  (t) => ({
    uniqueUserInGroup: unique().on(t.userId, t.groupId),
  }),
);

export const userRelations = relations(users, (relation) => ({
  userGroups: relation.many(groups),
}));

export const groupRelations = relations(users, (relation) => ({
  userGroups: relation.many(users),
}));

export const userGroupsRelations = relations(userGroups, ({ one }) => ({
  group: one(groups, { fields: [userGroups.id], references: [groups.id] }),
  user: one(users, { fields: [userGroups.id], references: [users.id] }),
}));

export type Users = InferSelectModel<typeof users>;

export type Groups = InferSelectModel<typeof groups>;
