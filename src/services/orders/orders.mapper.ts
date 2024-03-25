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
        if (cart.hasAdditional && result.total > 0) {
          const withAdditional = CartMath.sumWithAdditional(math, ownTotal);
          const price = (withAdditional - ownTotal).toString();
          ownTotal = withAdditional;
          result.items.push({
            category: Categories.additional.name,
            createdAt: order.createdAt,
            id: uuidv7(),
            orderId: order.id,
            ownerId,
            price,
            quantity: "1",
            title: Orders.OrderItem.Additional,
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
            id: uuidv7(),
            orderId: order.id,
            ownerId,
            price,
            quantity: "1",
            title: Orders.OrderItem.Couvert,
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
    const userData = Dict.from("id", cart.users);
    return {
      id: order.id,
      ownerId: order.ownerId,
      lastUpdatedAt: order.lastUpdatedAt,
      metadata: order.metadata,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      title: order.title,
      type: order.type,
      category: order.category,
      currencyCode: order.currencyCode,
      users: result.payments.map((x): Orders.UserInfo => {
        const data = userData.get(x.ownerId);
        return {
          id: x.ownerId,
          payment: payments.get(x.ownerId)![0],
          orderItem: products.get(x.ownerId)!,
          data: { id: x.ownerId, name: data?.name } as Orders.UserInfo["data"],
        };
      }),
    };
  };

  const createMetadata = (
    cart: OrdersValidator.Cart,
    items: ParseProductsProps["items"],
  ) => {
    const metadata: Record<string, any> = {
      ...cart.metadata,
      consumers: cart.users.length,
      percentAdditional: "",
      additional: 0,
      couvert: 0,
    };
    if (cart.hasAdditional) {
      metadata.percentAdditional = cart.additional;
      metadata.additional = items.reduce(
        (acc, el) =>
          acc + (el.category === "additional" ? Number(el.total) : 0),
        0,
      );
    }
    if (cart.hasCouvert) metadata.couvert = fromStrNumber(cart.couvert);
    return metadata as DB.Order["metadata"];
  };

  export const toDb = (cart: OrdersValidator.Cart): Result => {
    const order: DB.Order = {
      id: uuidv7(),
      total: "",
      createdAt: new Date(),
      type: cart.type,
      lastUpdatedAt: null,
      title: cart.title,
      ownerId: cart.me?.id!,
      metadata: {} as any,
      category: cart.category,
      currencyCode: cart.currencyCode,
      status: OrdersValidator.CartStatus.pending,
    } satisfies DB.Order;
    const result = parseProducts(order, { ...cart, products: cart.products });
    order.total = result.total.toString();
    order.metadata = createMetadata(cart, result.items);
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
}
