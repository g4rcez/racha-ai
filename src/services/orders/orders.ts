import { db } from "~/db";
import { orderItems, orders, payments } from "~/db/orders";
import { DB } from "~/db/types";
import { Either } from "~/lib/either";
import { OrdersMapper } from "~/services/orders/orders.mapper";

export namespace Orders {
  export const createOrderItems = async (
    transaction: DB.Transaction,
    items: DB.OrderItem[],
  ): Promise<DB.OrderItem[]> =>
    Promise.all(
      items.map(async (item) => {
        await transaction.insert(orderItems).values(item).execute();
        return item;
      }),
    );

  export const createPayments = async (
    transaction: DB.Transaction,
    items: DB.Payment[],
  ): Promise<DB.Payment[]> =>
    Promise.all(
      items.map(async (payment) => {
        await transaction.insert(payments).values(payment).execute();
        return payment;
      }),
    );

  export const create = async (result: OrdersMapper.Result) => {
    const order = result.order;
    return db.transaction(async (transaction) => {
      try {
        await db.insert(orders).values(order);
        await createOrderItems(transaction, result.items);
        await createPayments(transaction, result.payments);
        return Either.success(order);
      } catch (e) {
        transaction.rollback();
        return Either.error(e);
      }
    });
  };
}
