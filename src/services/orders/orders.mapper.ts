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
    amount: z.string(),
    createdAt: date,
    id,
    orderId: id,
    ownerId: id,
    status: z.string(),
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

  const order = z.object({
    category: z.string(),
    createdAt: z.string().default(() => new Date().toISOString()),
    currencyCode: z.string().default("BRL"),
    id: z.string().default(() => uuidv7()),
    lastUpdatedAt: z.string().datetime().optional().nullable(),
    metadata: z.object({
      base: z.number(),
      additional: z.number(),
      consumers: z.number(),
      couvert: z.number(),
      products: z.record(z.any()).default({}),
    }),
    ownerId: z.string(),
    status: z.string(),
    title: z.string(),
    total: z.string(),
    type: z.string(),
  });

  export const historySchema = z.object({
    id: z.string(),
    payments: z.array(payment),
    items: z.array(orderItem),
    order: order,
  });

  export type OrderItem = z.infer<typeof orderItem>;

  export const schema = order.extend({ couvert: z.string(), tip: z.string() });

  export type Order = z.infer<typeof schema>;

  const parseOrder = (
    order: Order,
    payments: DB.Payment[],
    date: Date,
    basePayment: number,
    items: DB.OrderItem[],
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
        products: countProducts(items),
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

  const countProducts = (
    orderItems: DB.OrderItem[],
  ): DB.Order["metadata"]["products"] => {
    const group = Dict.groupBy("productId", orderItems);
    return group.toArray().reduce((acc, cur) => {
      const first = cur[0];
      if (Product.isTipOrCouvert(first)) return acc;
      const product = cur.reduce(
        (x, y) => ({
          ...x,
          ...y,
          consumed: ((x as any).consumed || 0) + fromStrNumber(x.quantity),
        }),
        { ...cur[0], consumed: 0 },
      );
      return { ...acc, [product.productId]: product };
    }, {});
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
      order: parseOrder(order, x.payments, now, x.base, x.items),
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
    return {
      ...order,
      users: Array.from(userInfo.values()),
      metadata: {
        ...order.metadata,
        products: countProducts(result.map((x) => x.orderItem)),
      },
    };
  };

  export const parseProduct = (item: OrderItem): DB.OrderItem => ({
    ...item,
    price: item.price.toString(),
    total: item.total.toString(),
    quantity: item.quantity.toString(),
    createdAt: new Date(item.createdAt),
  });

  export const parseOrderResponse = (
    x: Result,
    users: User[],
  ): Orders.Shape => {
    const paymentUsers = Dict.from("ownerId", x.payments);
    const items = Dict.groupBy("ownerId", x.items);
    return {
      ...x.order,
      metadata: {
        ...x.order.metadata,
        products: countProducts(x.items),
      },
      createdAt: new Date(x.order.createdAt),
      users: users.reduce<Orders.UserInfo[]>((acc, el) => {
        if (!paymentUsers.has(el.id)) return acc;
        const products = items.get(el.id)!;
        return acc.concat({
          id: el.id,
          data: el as any,
          orderItem: products,
          payment: paymentUsers.get(el.id)!,
        });
      }, []),
    };
  };

  export const parseOrdersAsResponse = (
    orders: Result[],
    users: User[],
  ): Orders.Shape[] => orders.map((x) => parseOrderResponse(x, users));

  export const fromResponseToOrder = (order: Orders.Shape): Result => {
    const result = order.users.reduce(
      (acc, el) => ({
        items: acc.items.concat(el.orderItem),
        payments: acc.payments.concat(el.payment as DB.Payment),
      }),
      {
        items: [] as DB.OrderItem[],
        payments: [] as DB.Payment[],
      },
    );
    return {
      order,
      id: order.id,
      items: result.items,
      payments: result.payments,
    };
  };
}
