import { DB } from "~/db/types";

export namespace Orders {
  export type UserInfo = {
    id: string;
    data: DB.User;
    payment: DB.Payment | null;
    orderItem: DB.OrderItem[];
  };

  export type Shape = DB.Order & { users: UserInfo[]; group: DB.Group | null };

  export type DB = {
    orders: DB.Order;
    user: DB.User;
    groups: DB.Group;
    payments: DB.Payment;
    orderItem: DB.OrderItem;
  };

  export enum OrderItem {
    Couvert = "@internal/couvert",
    Additional = "@internal/additional",
  }
}
