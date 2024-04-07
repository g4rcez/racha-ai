import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import type { DB } from "~/db/types";
import { Dict } from "~/lib/dict";
import { fromStrNumber } from "~/lib/fn";
import { Product } from "~/models/product";
import { Orders } from "~/services/orders/orders.types";
import { User } from "~/store/friends.store";

export namespace OrdersMapper {
  export type Result = {
    id: string;
    order: DB.Order;
    payments: DB.Payment[];
    items: DB.OrderItem[];
  };

  const date = z.string().datetime().or(z.date());

  const id = z.string().uuid();

  export const payment = z.object({
    id,
    status: z.string(),
    orderId: id,
    ownerId: id,
    amount: z.number(),
    createdAt: date,
  });

  export type Payment = z.infer<typeof payment>;

  export const orderItem = z.object({
    category: z.string(),
    createdAt: date,
    id,
    orderId: id,
    ownerId: id,
    price: z.string(),
    productId: z.string().uuid(),
    quantity: z.string(),
    splitType: z.string(),
    title: z.string(),
    total: z.string(),
    type: z.string(),
  });

  export type OrderItem = z.infer<typeof orderItem>;

  export const schema = z.object({
    couvert: z.string(),
    tip: z.string(),
    id: z.string().uuid(),
    title: z.string(),
    createdAt: z.string().datetime().or(z.date()),
    lastUpdatedAt: z.string().nullable().or(z.date()).nullable(),
    total: z.coerce.number(),
    type: z.string(),
    category: z.string(),
    status: z.string(),
    currencyCode: z.string().default("BRL"),
    ownerId: z.string(),
    metadata: z
      .object({
        couvert: z.number(),
        consumers: z.number(),
        additional: z.number(),
        percentAdditional: z.number().min(0).max(1),
        names: z.record(z.string()),
      })
      .partial()
      .default({}),
  });

  export type Order = z.infer<typeof schema>;

  const parseOrder = (
    order: Order,
    payments: DB.Payment[],
    date: Date,
    basePayment: number,
  ): DB.Order => {
    const tip = calculateTip(order.tip);
    return {
      id: order.id,
      ownerId: order.ownerId,
      type: order.type,
      category: order.category,
      title: order.title,
      total: payments
        .reduce((acc, el) => Number(el.amount) + acc, 0)
        .toString(),
      createdAt: date,
      currencyCode: order.currencyCode,
      status: order.status,
      lastUpdatedAt: null,
      metadata: {
        additional: tip,
        base: basePayment,
        consumers: payments.length,
        couvert: calculateCouvert(order.couvert),
      },
    };
  };

  type OrderItemPayments = {
    payment: DB.Payment;
    items: DB.OrderItem[];
    base: number;
  };

  const calculateTip = (tip: string) =>
    tip === "" ? 1 : fromStrNumber(tip) / 100 + 1;

  const calculateCouvert = (couvert: string) =>
    couvert === "" ? 0 : fromStrNumber(couvert);

  const calculateTotal = (
    items: DB.OrderItem[],
    tip: string,
    couvert: string,
  ) => {
    const item = items[0];
    const base = items.reduce((acc, cur) => acc + Number(cur.total), 0);
    let amount = base;
    const numberTip = calculateTip(tip);
    const numberCouvert = calculateCouvert(couvert);
    const common = {
      orderId: item.orderId,
      ownerId: item.ownerId,
      type: item.type,
      category: item.category,
      splitType: item.splitType,
    };
    if (numberTip > 0) {
      const total = amount * numberTip - amount;
      amount *= numberTip;
      items.push(Product.tip({ ...common, total: total.toString() }));
    }
    if (numberCouvert > 0) {
      amount += numberCouvert;
      items.push(
        Product.couvert({ ...common, total: numberCouvert.toString() }),
      );
    }
    return { amount, items, base };
  };

  const fetchPayments = (
    order: Order,
    orderItems: DB.OrderItem[],
    date: Date,
  ): OrderItemPayments[] =>
    Dict.groupBy("ownerId", orderItems).arrayMap((value): OrderItemPayments => {
      const product = value[0];
      const result = calculateTotal(value, order.tip, order.couvert);
      const payment: DB.Payment = {
        amount: result.amount.toString(),
        createdAt: date,
        id: uuidv7(),
        orderId: order.id,
        ownerId: product.ownerId,
        status: "",
      };
      return { payment, items: result.items, base: result.base };
    });

  export const splitBills = (order: Order, items: DB.OrderItem[]): Result => {
    const now = new Date();
    const result = fetchPayments(order, items, now);
    const x = result.reduce(
      (acc, el) => ({
        base: acc.base + el.base,
        items: acc.items.concat(el.items),
        payments: acc.payments.concat(el.payment),
      }),
      { items: [] as DB.OrderItem[], payments: [] as DB.Payment[], base: 0 },
    );
    return {
      id: order.id,
      items: x.items,
      payments: x.payments,
      order: parseOrder(order, x.payments, now, x.base),
    };
  };

  const createDefaultInfo = (userId: string): Orders.UserInfo => ({
    id: userId,
    payment: null,
    data: {} as any,
    orderItem: [],
  });

  export const toRequest = (result: Orders.DB[]): Orders.Shape => {
    const first = result[0];
    const order = first.orders;
    const userInfo = new Map<string, Orders.UserInfo>();
    result.forEach((order) => {
      const info =
        userInfo.get(order.user.id) || createDefaultInfo(order.user.id);
      info.data = order.user;
      info.payment = order.payments;
      info.orderItem.push(order.orderItem);
      userInfo.set(order.user.id, info);
    });
    return { ...order, users: Array.from(userInfo.values()) };
  };

  export const historySchema = z.object({
    id: z.string(),
    payments: z.array(
      z.object({
        amount: z.string(),
        createdAt: z.string(),
        id: z.string(),
        orderId: z.string(),
        ownerId: z.string(),
        status: z.string(),
      }),
    ),
    items: z.array(
      z.object({
        category: z.string(),
        createdAt: z.string(),
        id: z.string(),
        orderId: z.string(),
        ownerId: z.string(),
        price: z.string(),
        productId: z.string(),
        quantity: z.string(),
        splitType: z.string(),
        title: z.string(),
        total: z.string(),
        type: z.string(),
      }),
    ),
    order: z.object({
      id: z.string(),
      ownerId: z.string(),
      type: z.string(),
      category: z.string(),
      title: z.string(),
      total: z.string(),
      createdAt: z.string(),
      currencyCode: z.string(),
      status: z.string(),
      lastUpdatedAt: z.string().datetime().optional().nullable(),
      metadata: z.object({
        base: z.number(),
        additional: z.number(),
        consumers: z.number(),
        couvert: z.number(),
      }),
    }),
  });

  export const parseProduct = (item: OrderItem): DB.OrderItem => ({
    ...item,
    price: item.price.toString(),
    total: item.total.toString(),
    quantity: item.quantity.toString(),
    createdAt: new Date(item.createdAt),
  });

  export const parseRawOrder = (x: Result, users: User[]) => {
    const paymentUsers = Dict.from("ownerId", x.payments);
    const items = Dict.groupBy("ownerId", x.items);
    return {
      ...x.order,
      createdAt: new Date(x.order.createdAt),
      users: users.reduce<Orders.UserInfo[]>((acc, el) => {
        if (!paymentUsers.has(el.id)) return acc;
        return acc.concat({
          id: el.id,
          data: el as any,
          orderItem: items.get(el.id)!,
          payment: paymentUsers.get(el.id)!,
        });
      }, []),
    };
  };

  export const parseToRawOrder = (
    orders: Result[],
    users: User[],
  ): Orders.Shape[] => {
    return orders.map((x) => parseRawOrder(x, users));
  };
}
