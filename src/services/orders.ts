import { User, Group } from "../db/users";
import { CartState } from "../store/cart.store";
import { Order, OrderItem, Payment, orders } from "../db/orders";
import { db } from "../db";
import { uuidv7 } from "@kripod/uuidv7";

export namespace Orders {
  export const createOrderItems = async (): Promise<OrderItem[]> => [];

  export const createPayments = async (): Promise<Payment[]> => [];

  export const create = async (owner: User, group: Group, cart: CartState) => {
    return db.transaction(async (transaction) => {
      const id = uuidv7();
      const now = new Date();
      const order: Order = {
        id,
        createdAt: now,
        title: cart.title,
        type: "restaurant",
        total: cart.total,
        status: cart.status,
        groupId: group.id,
        ownerId: owner.id,
        category: "",
        metadata: cart.metadata,
        currencyCode: "BRL",
        lastUpdatedAt: null,
      };
      try {
        await db.insert(orders).values(order);
        await createOrderItems();
        await createPayments();
      } catch (e) {
        transaction.rollback();
        return Either.error(e);
      }
    });
  };
}
