import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { Store } from "~/models/store";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { ParseToRaw } from "~/types";

const schemas = {
  v1: Store.validator(
    z.object({
      items: z.array(OrdersMapper.historySchema),
    }),
  ),
};

type State = { items: OrdersMapper.Result[] };

const parse = (item: OrdersMapper.Result): OrdersMapper.Result => {
  const validation = OrdersMapper.historySchema.safeParse(item);
  if (!validation.success)
    console.log("Error parsing validation", item, validation.error.issues);
  return validation.success ? validation.data : (null as any);
};

const parseAll = (s?: ParseToRaw<State>): State => ({
  items: ((s?.items as unknown as ParseToRaw<OrdersMapper.Result>[]) ?? [])
    .map(parse)
    .toSorted((a, b) => b.order.id.localeCompare(a.order.id)),
});

export const History = Store.create(
  { schemas, name: "history", version: "v1" },
  parseAll,
  () => ({ refresh: (state: State) => state }),
  (args) => ({
    init: () => args.getState(),
    get: (id: string, users: any[]) => {
      const storage =
        (LocalStorage.get(args.storageKey) as {
          items: OrdersMapper.Result[];
        }) || null;
      if (storage === null) return null;
      const item = storage.items.find((item) => item.id === id);
      return item ? OrdersMapper.parseRawOrder(item, users) : null;
    },
    save: (result: OrdersMapper.Result) => {
      const storage = (LocalStorage.get(args.storageKey) || {
        items: [],
      }) as State;
      const carts = Dict.from("id", storage.items).set(result.order.id, result);
      LocalStorage.set(args.storageKey, { items: carts.toArray() });
      return result;
    },
  }),
);
