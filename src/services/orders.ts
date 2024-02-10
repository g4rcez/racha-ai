import { uuidv7 } from "@kripod/uuidv7";
import { db } from "~/db";
import { Order, OrderItem, orders, Payment } from "~/db/orders";
import { Group, User } from "~/db/users";
import { Either } from "~/lib/either";
import { HistoryItem } from "~/store/history.store";

export namespace Orders {
  export const createOrderItems = async (): Promise<OrderItem[]> => [];

  export const createPayments = async (): Promise<Payment[]> => [];

  export const create = async (
    owner: User,
    group: Group,
    cart: HistoryItem,
  ) => {
    return db.transaction(async (transaction) => {
      const id = uuidv7();
      const now = new Date();
      const order: Order = {
        id,
        createdAt: now,
        title: cart.title,
        type: "restaurant",
        total: cart.total.toString(),
        status: "finished",
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
        return Either.success(order);
      } catch (e) {
        transaction.rollback();
        return Either.error(e);
      }
    });
  };
}
