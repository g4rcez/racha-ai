import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { i18n } from "~/i18n";
import { CartMath } from "~/lib/cart-math";
import { Dict } from "~/lib/dict";
import { sortId, sum } from "~/lib/fn";
import { Categories } from "~/models/categories";
import { Store } from "~/models/store";
import { Product } from "~/models/product";
import { CartState, CartUser } from "~/store/cart.store";
import { Friends } from "~/store/friends.store";
import { Override, ParseToRaw } from "~/types";

export enum HistoryType {
  Restaurant = "restaurant",
  Trip = "trip",
  Account = "account",
  MensalCosts = "mensal-costs",
}

type HistoryProduct = Product & { total: number };

type Result = { total: number; additional: number; totalWithCouvert: number };

type HistoryUser = CartUser & {
  sum: number;
  result: Result;
  products: HistoryProduct[];
};

export type HistoryItem = Override<
  CartState,
  {
    total: number;
    couvert: number;
    additional: number;
    totalProducts: number;
    withAdditional: number;
    users: Dict<string, HistoryUser>;
  }
>;

type State = { items: HistoryItem[] };

const product = Product.schema.extend({ total: z.number() });

const commonSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: Store.date,
  readonly: z.boolean().default(false),
  historyType: z.nativeEnum(HistoryType),
});

const schemas = {
  v1: Store.validator(
    z.object({
      items: z.array(
        z.discriminatedUnion("historyType", [
          z.object({
            ...commonSchema.shape,
            historyType: z.literal(HistoryType.Restaurant),
            type: z.string(),
            couvert: z.string(),
            withAdditional: z.number(),
            additional: z.string(),
            hasCouvert: z.boolean(),
            hasAdditional: z.string(),
            totalProducts: z.number(),
            users: z.array(
              z.object({
                ...Friends.schema.shape,
                sum: z.number(),
                products: z.array(product),
                result: z.object({
                  total: z.number(),
                  additional: z.number(),
                  totalWithCouvert: z.number(),
                }),
              }),
            ),
            products: z.array(product),
          }),
          z.object({ historyType: z.literal(HistoryType.Trip) }),
        ]),
      ),
    }),
  ),
};

const parse = (item: ParseToRaw<HistoryItem>): HistoryItem => ({
  ...item,
  createdAt: new Date(item.createdAt),
  finishedAt: new Date(item.finishedAt),
  withAdditional:
    item.withAdditional ??
    item.products.reduce((acc, x) => acc + x.price * x.quantity, 0) *
      (item.additional - 1),
  products: Dict.from(
    "id",
    item.products.map((x) => ({
      ...x,
      consumers: Dict.from("id", x.consumers),
    })),
  ),
  users: Dict.from("id", item.users, (x) => ({
    ...x,
    createdAt: new Date(x.createdAt),
    paidAt: x.paidAt ? new Date(x.paidAt) : null,
  })),
});

const parseAll = (s?: ParseToRaw<State>): State => ({
  items: ((s?.items as unknown as ParseToRaw<HistoryItem>[]) ?? [])
    .map(parse)
    .toSorted(sortId),
});

const parseFromCart = (ownerId: string, cart: CartState): HistoryItem => {
  const {
    additional,
    couvert,
    total,
    products: sumProducts,
  } = CartMath.calculate(cart);
  const products = cart.products.toArray();
  const users = cart.users.toArray().map((user) => {
    const result = CartMath.perUser(products, user, additional, couvert);
    const ownProducts = products.reduce<HistoryProduct[]>((acc, p) => {
      const i = Dict.toArray(p.consumers).find((x) => x.id === user.id);
      return i === undefined
        ? acc
        : [
            ...acc,
            {
              ...p,
              quantity: i.quantity,
              total: i.quantity * p.price,
              createdAt: p.createdAt,
            },
          ];
    }, [] as HistoryProduct[]);
    return {
      ...user,
      result,
      products: ownProducts,
      sum: ownProducts.reduce((acc, el) => sum(acc, el.total), 0),
    };
  });
  const calculate = CartMath.calculate(cart);
  return {
    total,
    type: cart.type,
    category: cart.category || Categories.default.name,
    metadata: cart.metadata || {},
    couvert: calculate.couvert.each,
    additional: calculate.additional,
    withAdditional: (calculate.additional - 1) * calculate.products,
    currencyCode: cart.currencyCode,
    totalProducts: sumProducts,
    products: cart.products,
    createdAt: cart.createdAt,
    finishedAt: cart.finishedAt ?? new Date(),
    hasAdditional: cart.hasAdditional,
    hasCouvert: cart.hasCouvert,
    justMe: cart.justMe,
    id: cart.id,
    title: cart.title,
    currentProduct: null,
    users: Dict.from(
      "id",
      users.toSorted((a, b) =>
        a.id === ownerId || b.id === ownerId ? 1 : b.sum - a.sum,
      ),
    ),
  };
};

export const History = Store.create(
  { schemas, name: "history", version: "v1" },
  parseAll,
  () => ({ refresh: (state: State) => state }),
  (args) => ({
    parse,
    init: args.getState,
    save: (ownerId: string, cart: CartState) => {
      const storage = (LocalStorage.get(args.storageKey) as {
        items: HistoryItem[];
      }) || { items: [] };
      const carts = Dict.from("id", storage.items).set(
        cart.id,
        parseFromCart(ownerId, cart),
      );
      LocalStorage.set(args.storageKey, { items: carts.toArray() });
      return cart;
    },
    get: (id: string): HistoryItem | null => {
      const storage =
        (LocalStorage.get(args.storageKey) as {
          items: ParseToRaw<HistoryItem>[];
        }) || null;
      if (storage === null) return null;
      const item = storage.items.find((item) => item.id === id);
      return item === undefined ? null : parse(item);
    },
    parseToCart: (item: HistoryItem): CartState => ({
      ...item,
      couvert: i18n.format.money(item.couvert),
      additional: item.hasAdditional
        ? i18n.format.percent(item.additional - 1)
        : "0",
      products: Dict.from(
        "id",
        item.products.toArray().map((product) => ({
          ...product,
          consumers: Dict.from("id", product.consumers.toArray()),
        })),
      ),
    }),
  }),
);
