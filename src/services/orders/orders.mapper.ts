import { uuidv7 } from "@kripod/uuidv7";
import { DB } from "~/db/types";
import { CartMath } from "~/lib/cart-math";
import { Dict } from "~/lib/dict";
import { fromStrNumber } from "~/lib/fn";
import { Categories } from "~/models/categories";
import { OrdersValidator } from "~/services/orders/order.validator";
import { Orders } from "~/services/orders/orders.types";

export namespace OrdersMapper {
  export type Result = {
    order: DB.Order;
    payments: DB.Payment[];
    items: DB.OrderItem[];
  };

  type CartProduct = OrdersValidator.Cart["products"][0];

  type ParseProductsProps = {
    items: DB.OrderItem[];
    payments: DB.Payment[];
    total: number;
  };

  type Info = { product: CartProduct; user: CartProduct["consumers"][0] };

  const createOrderItems = (
    total: number,
    info: Info[],
    order: DB.Order,
    ownerId: string,
  ) => {
    const items = info.map(({ product, user }): DB.OrderItem => {
      const orderTotal = product.price * user.quantity;
      total += orderTotal;
      return {
        orderId: order.id,
        id: uuidv7(),
        groupId: order.groupId,
        ownerId,
        type: order.type,
        createdAt: order.createdAt,
        category: order.category,
        title: product.name,
        total: orderTotal.toString(),
        price: product.price.toString(),
        quantity: user.quantity.toString(),
      };
    });
    return { items, total };
  };

  const parseProducts = (order: DB.Order, cart: OrdersValidator.Cart) => {
    const math = CartMath.calculate(cart as any);
    const map = new Map<string, Info[]>();
    cart.products.forEach((product) => {
      product.consumers.forEach((user) => {
        const info = map.get(user.id) || [];
        map.set(user.id, [...info, { product, user }]);
      });
    });
    return Array.from(map.entries()).reduce<ParseProductsProps>(
      (acc, [ownerId, info]): ParseProductsProps => {
        let ownTotal = 0;
        const result = createOrderItems(ownTotal, info, order, ownerId);
        ownTotal += result.total;
        if (cart.hasAdditional) {
          const withAdditional = CartMath.sumWithAdditional(math, ownTotal);
          const price = (withAdditional - ownTotal).toString();
          ownTotal = withAdditional;
          result.items.push({
            category: Categories.additional.name,
            createdAt: order.createdAt,
            groupId: order.groupId,
            id: uuidv7(),
            orderId: order.id,
            ownerId,
            price,
            quantity: "1",
            title: "@internal/additional",
            total: price,
            type: order.type,
          });
        }
        if (cart.hasCouvert) {
          const price = math.couvert.each.toString();
          ownTotal += math.couvert.each;
          result.items.push({
            category: Categories.couvert.name,
            createdAt: order.createdAt,
            groupId: order.groupId,
            id: uuidv7(),
            orderId: order.id,
            ownerId,
            price,
            quantity: "1",
            title: "@internal/couvert",
            total: price,
            type: order.type,
          });
        }
        return {
          total: ownTotal + acc.total,
          items: acc.items.concat(result.items),
          payments: acc.payments.concat({
            id: uuidv7(),
            createdAt: order.createdAt,
            groupId: order.groupId,
            orderId: order.id,
            ownerId,
            status: OrdersValidator.CartStatus.pending,
            amount: ownTotal.toString(),
          }),
        };
      },
      {
        total: 0,
        items: [],
        payments: [],
      } as ParseProductsProps,
    );
  };

  export const fromCart = (cart: OrdersValidator.Cart): Orders.Shape => {
    const result = toDb(cart);
    const order = result.order;
    const payments = Dict.groupBy("ownerId", result.payments);
    const products = Dict.groupBy("ownerId", result.items);
    return {
      id: order.id,
      ownerId: order.ownerId,
      group: {} as any,
      groupId: order.groupId,
      lastUpdatedAt: order.lastUpdatedAt,
      metadata: order.metadata,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      title: order.title,
      type: order.type,
      category: order.category,
      currencyCode: order.currencyCode,
      users: result.payments.map(
        (x): Orders.UserInfo => ({
          id: x.ownerId,
          data: { id: x.ownerId } as Orders.UserInfo["data"],
          payment: payments.get(x.ownerId)![0],
          orderItem: products.get(x.ownerId)!,
        }),
      ),
    };
  };

  export const toDb = (cart: OrdersValidator.Cart): Result => {
    const order = {
      id: uuidv7(),
      total: "",
      createdAt: new Date(),
      type: cart.type,
      lastUpdatedAt: null,
      title: cart.title,
      ownerId: cart.me?.id!,
      groupId: cart.groupId || null,
      metadata: { ...cart.metadata, consumers: cart.users.length },
      category: cart.category,
      currencyCode: cart.currencyCode,
      status: OrdersValidator.CartStatus.pending,
    } satisfies DB.Order;
    const result = parseProducts(order, { ...cart, products: cart.products });
    order.total = result.total.toString();
    if (cart.hasAdditional) {
      (order.metadata as any).additional = result.items.reduce(
        (acc, el) =>
          acc + (el.category === "additional" ? Number(el.total) : 0),
        0,
      );
    }
    if (cart.hasCouvert)
      (order.metadata as any).couvert = fromStrNumber(cart.couvert);
    return { order, items: result.items, payments: result.payments };
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
    const group = first.groups || null;
    const userInfo = new Map<string, Orders.UserInfo>();
    result.forEach((order) => {
      const info =
        userInfo.get(order.user.id) || createDefaultInfo(order.user.id);
      info.data = order.user;
      info.payment = order.payments;
      info.orderItem.push(order.orderItem);
      userInfo.set(order.user.id, info);
    });
    return { ...order, group, users: Array.from(userInfo.values()) };
  };
}
