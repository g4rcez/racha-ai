import { DB } from "~/db/types";

export namespace Orders {
  export type UserInfo = {
    id: string;
    data: DB.User;
    payment: DB.Payment | null;
    orderItem: DB.OrderItem[];
  };

  export type Shape = DB.Order & { users: UserInfo[] };

  export type DB = {
    orders: DB.Order;
    user: DB.User;
    payments: DB.Payment;
    orderItem: DB.OrderItem;
  };

  export enum OrderItem {
    Couvert = "@racha-ai/couvert",
    Additional = "@racha-ai/tip",
  }
}
