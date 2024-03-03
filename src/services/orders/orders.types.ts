import { DB } from "~/db/types";
import { Override } from "~/types";

export namespace Orders {
  export type UserInfo = {
    id: string;
    data: DB.User;
    payment: DB.Payment | null;
    orderItem: DB.OrderItem[];
  };

  export type Shape = Override<
    DB.Order,
    {
      metadata: {
        couvert: number;
        consumers: number;
        additional: number;
      };
    }
  > & { users: UserInfo[]; group: DB.Group | null };

  export type DB = {
    orders: DB.Order;
    user: DB.User;
    groups: DB.Group;
    payments: DB.Payment;
    orderItem: DB.OrderItem;
  };
}