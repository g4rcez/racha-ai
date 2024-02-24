import { uuidv7 } from "@kripod/uuidv7";
import { DB } from "~/db/types";
import { CartMath } from "~/lib/cart-math";
import { Categories } from "~/models/categories";
import { OrdersValidator } from "~/services/orders/order.validator";

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

  export const parse = (cart: OrdersValidator.Cart): Result => {
    const id = uuidv7();
    const now = new Date();
    const order = {
      id,
      total: "",
      createdAt: now,
      type: cart.type,
      lastUpdatedAt: now,
      title: cart.title,
      ownerId: cart.me?.id!,
      groupId: cart.groupId,
      metadata: cart.metadata,
      category: cart.category,
      currencyCode: cart.currencyCode,
      status: OrdersValidator.CartStatus.pending,
    } satisfies DB.Order;
    const result = parseProducts(order, cart);
    order.total = result.total.toString();
    return { order, items: result.items, payments: result.payments };
  };
}
