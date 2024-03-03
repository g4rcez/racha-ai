import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { sortId } from "~/lib/fn";
import { Store } from "~/models/store";
import { OrdersValidator } from "~/services/orders/order.validator";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { Orders } from "~/services/orders/orders.types";
import { CartState } from "~/store/cart.store";
import { ParseToRaw } from "~/types";

type State = { items: Orders.Shape[] };

const schemas = {
  v1: Store.validator(z.object({ items: z.array(OrdersValidator.cartSchema) })),
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
    parseToCart: (item: Orders.Shape): CartState => {
      return {
        type: item.type,
        category: item.category,
        createdAt: item.createdAt,
        finishedAt: item.lastUpdatedAt ?? new Date(),
        title: item.title,
        currencyCode: item.currencyCode,
      } as any;
    },
  }),
);
