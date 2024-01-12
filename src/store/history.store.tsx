import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { i18n } from "~/i18n";
import { CartMath } from "~/lib/cart-math";
import { Dict } from "~/lib/dict";
import { fromStrNumber, sum } from "~/lib/fn";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { link, links, navigate } from "~/router";
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
    users: Dict<string, HistoryUser>;
  }
>;

type State = { items: HistoryItem[] };

const product = z.object({ ...Product.schema.shape, total: z.number() });

const commonSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: Entity.dateSchema,
  readonly: z.boolean().default(false),
  historyType: z.nativeEnum(HistoryType),
});

const schemas = {
  v1: Entity.validator(
    z.object({
      items: z.array(
        z.discriminatedUnion("historyType", [
          z.object({
            ...commonSchema.shape,
            historyType: z.literal(HistoryType.Restaurant),
            type: z.string(),
            couvert: z.string(),
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
  items: ((s?.items as unknown as ParseToRaw<HistoryItem>[]) ?? []).map(parse),
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
  return {
    total,
    type: cart.type,
    couvert: fromStrNumber(cart.couvert),
    additional: fromStrNumber(cart.additional),
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

export const History = Entity.create(
  { schemas, name: "history", version: "v1" },
  parseAll,
  () => ({ refresh: (state: State) => state }),
  (args) => ({
    parse,
    init: args.getState,
    view: (id: string) => navigate.push(link(links.cartHistory, { id })),
    save: (ownerId: string, cart: CartState) => {
      const storage = (LocalStorage.get(args.storageKey) as {
        items: HistoryItem[];
      }) || { items: [] };
      const carts = Dict.from("id", storage.items);
      carts.set(cart.id, parseFromCart(ownerId, cart));
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
      additional: i18n.format.percent(item.additional / 100),
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
