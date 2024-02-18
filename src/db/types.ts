import type { InferSelectModel } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import type { db } from "~/db/index";
import type { users, groups, userGroups } from "~/db/users";
import type { orders, payments } from "~/db/orders";

export namespace DB {
  export type User = InferSelectModel<typeof users>;

  export type Group = InferSelectModel<typeof groups>;

  export type UserGroup = InferSelectModel<typeof userGroups>;

  export type Order = InferSelectModel<typeof orders>;

  export type Payment = InferSelectModel<typeof payments>;

  export type Query = typeof db | PgTransaction<any>;
}
