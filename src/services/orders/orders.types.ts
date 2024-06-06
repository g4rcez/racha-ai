import { DbOrder, DbOrderItem, DbPayments, DbUser } from "~/types";

export namespace Orders {
    export type UserInfo = {
        id: string;
        data: DbUser;
        payment: DbPayments | null;
        orderItem: DbOrderItem[];
    };

    export type Shape = DbOrder & { users: UserInfo[] };

    export type DB = {
        orders: DbOrder;
        user: any;
        payments: DbPayments;
        orderItem: DbOrderItem;
    };

    export enum OrderItem {
        Couvert = "@racha-ai/couvert",
        Additional = "@racha-ai/tip"
    }
}
