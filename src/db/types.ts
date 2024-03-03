import type { InferSelectModel } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import type { db } from "~/db/index";
import type { users, groups, userGroups } from "~/db/users";
import type { orderItems, orders, payments } from "~/db/orders";
import { Override } from "~/types";

export namespace DB {
  export type User = InferSelectModel<typeof users>;

  export type Group = InferSelectModel<typeof groups>;

  export type UserGroup = InferSelectModel<typeof userGroups>;

  export type Order = Override<
    InferSelectModel<typeof orders>,
    {
      metadata: {
        couvert: number;
        consumers: number;
        additional: number;
        percentAdditional: string;
      };
    }
  >;

  export type OrderItem = InferSelectModel<typeof orderItems>;

  export type Payment = InferSelectModel<typeof payments>;

  export type Query = typeof db | PgTransaction<any>;

  export type Transaction = NonNullable<
    Parameters<NonNullable<Parameters<typeof db.transaction>[0]>>[0]
  >;
}
