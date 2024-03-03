import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { i18n } from "~/i18n";
import { Dict } from "~/lib/dict";
import { sortId } from "~/lib/fn";
import { Division } from "~/models/entity-types";
import { Store } from "~/models/store";
import { OrdersValidator } from "~/services/orders/order.validator";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { Orders } from "~/services/orders/orders.types";
import { CartProduct, CartState, CartUser } from "~/store/cart.store";
import { ParseToRaw } from "~/types";

type State = { items: Orders.Shape[] };

const schemas = {
  v1: Store.validator(z.object({ items: z.array(OrdersValidator.cartSchema) })),
};

const parseToCart = (order: Orders.Shape): CartState => {
  const users = Dict.from(
    "id",
    order.users.map((user) => ({
      id: user.id,
      name: user.data.name!,
      createdAt: new Date(),
    })),
  );
  const products = Dict.groupBy(
    "title",
    order.users.flatMap((data) => {
      return data.orderItem.map((orderItem) => ({
        ...data,
        ...orderItem,
      }));
    }),
  );
  const cart = {
    users,
    type: order.type! as any,
    category: order.category!,
    createdAt: order.createdAt,
    finishedAt: order.lastUpdatedAt ?? new Date(),
    title: order.title,
    currencyCode: order.currencyCode!,
    id: order.id,
    justMe: order.users.length === 1,
    metadata: order.metadata,
    products: new Dict(),
    additional: "",
    couvert: "",
    hasAdditional: false,
    hasCouvert: false,
    currentProduct: null,
  };
  if (products.has(Orders.OrderItem.Couvert)) {
    const item = products.get(Orders.OrderItem.Couvert);
    const couvert = i18n.format.percent(Number(item?.[0].price));
    cart.hasCouvert = true;
    cart.couvert = couvert;
    products.remove(Orders.OrderItem.Couvert);
  }
  if (products.has(Orders.OrderItem.Additional)) {
    cart.additional = order.metadata.percentAdditional;
    cart.hasAdditional = true;
    products.remove(Orders.OrderItem.Additional);
  }
  const consumedProducts = Array.from(products.values()).map(
    (items): CartProduct => {
      const first = items[0];
      const consumers: CartProduct["consumers"] = Dict.from(
        "id",
        items.map(
          (c): CartUser => ({
            createdAt: c.createdAt,
            quantity: Number(c.quantity),
            name: c.data.name!,
            id: c.data.id,
            amount: Number(c.price),
            paidAt: null,
          }),
        ),
      );
      return {
        consumers,
        id: first.id,
        price: Number(first.price),
        name: first.title,
        monetary: first.price,
        createdAt: first.createdAt,
        division: Division.PerConsume,
        quantity: items.length,
      };
    },
  );
  cart.products = Dict.from("id", consumedProducts);
  return cart as any;
};

const parse = (
  item: ParseToRaw<Orders.Shape | OrdersValidator.Cart>,
): Orders.Shape => {
  const validation = OrdersValidator.cartSchema.safeParse(item);
  if (validation.success) return OrdersMapper.fromCart(validation.data);
  const i = item as ParseToRaw<Orders.Shape>;
  return {
    ...i,
    createdAt: new Date(i.createdAt),
    lastUpdatedAt: i.lastUpdatedAt ? new Date(i.lastUpdatedAt) : null,
  };
};

const parseAll = (s?: ParseToRaw<State>): State => ({
  items: ((s?.items as unknown as ParseToRaw<Orders.Shape>[]) ?? [])
    .map(parse)
    .toSorted(sortId),
});

export const History = Store.create(
  { schemas, name: "history", version: "v1" },
  parseAll,
  () => ({ refresh: (state: State) => state }),
  (args) => ({
    parse,
    parseToCart,
    init: args.getState,
    save: (cart: CartState): Orders.Shape => {
      const storage = (LocalStorage.get(args.storageKey) as {
        items: Orders.Shape[];
      }) || { items: [] };
      const order = OrdersMapper.fromCart({
        ...cart,
        users: cart.users.toArray(),
        products: cart.products
          .toArray()
          .map((x) => ({ ...x, consumers: x.consumers.toArray() })),
      } as any);
      const carts = Dict.from("id", storage.items).set(order.id, order);
      LocalStorage.set(args.storageKey, { items: carts.toArray() });
      return order;
    },
    get: (id: string): Orders.Shape | null => {
      const storage =
        (LocalStorage.get(args.storageKey) as {
          items: ParseToRaw<Orders.Shape | OrdersValidator.Cart>[];
        }) || null;
      if (storage === null) return null;
      const item = storage.items.find((item) => item.id === id);
      return item ? parse(item) : null;
    },
  }),
);
