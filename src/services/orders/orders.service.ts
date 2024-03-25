import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { orderItems, orders, payments } from "~/db/orders";
import { DB } from "~/db/types";
import { users } from "~/db/users";
import { Either } from "~/lib/either";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { Orders } from "~/services/orders/orders.types";

export namespace OrdersService {
  const createOrderItems = async (
    transaction: DB.Transaction,
    items: DB.OrderItem[],
  ): Promise<DB.OrderItem[]> =>
    Promise.all(
      items.map(async (item) => {
        await transaction.insert(orderItems).values(item).execute();
        return item;
      }),
    );

  const createPayments = async (
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
        console.error(e);
        transaction.rollback();
        return Either.error(e);
      }
    });
  };

  const drizzleSelect = db
    .select({
      orders: orders,
      orderItem: orderItems,
      payments: payments,
      user: {
        id: users.id,
        image: users.image,
        name: users.name,
        email: users.email,
      },
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(payments, eq(orders.id, payments.orderId))
    .leftJoin(users, eq(users.id, payments.ownerId));

  const byId = Either.transform(async (id: string) => {
    const query = drizzleSelect.where(eq(orders.id, id));
    const result = await query.execute();
    return result;
  });

  export const getById = Either.transform(async (id: string) => {
    const order = await byId(id);
    return order.isSuccess() && order.success.length > 0
      ? (JSON.parse(
          JSON.stringify(OrdersMapper.toRequest(order.success as never)),
        ) as Orders.Shape)
      : null;
  });

  export const authorizedUser = Either.transform(async (id: string) => {
    const query = db
      .select()
      .from(orders)
      .leftJoin(payments, eq(orders.id, payments.id)).where(sql`(case
              when orders."groupId" is null then TRUE
              when uG."userId" = '${id}' then TRUE
              else FALSE end)`);
    const result = await query.execute();
    return result;
  });
}
