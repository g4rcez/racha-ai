import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { link, links, navigate } from "~/router";
import { Cart, CartState, CartUser } from "~/store/cart.store";
import { Friends } from "~/store/friends.store";
import { ParseToRaw } from "~/types";

export enum HistoryType {
    Restaurant = "restaurant",
    Trip = "trip",
    Account = "account",
    MensalCosts = "mensal-costs",
}

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
                        users: z.array(Friends.schema),
                        products: z.array(Product.schema),
                        currentProduct: z.array(Product.schema).nullable(),
                    }),
                    z.object({ historyType: z.literal(HistoryType.Trip) }),
                ]),
            ),
        }),
    ),
};

type HistoryItems = CartState;

type State = { items: HistoryItems[] };

const KEY = "@app/history";

const parse = (item: ParseToRaw<CartState>): CartState => ({
    ...item,
    createdAt: new Date(item.createdAt),
    products: Dict.from("id", item.products) as any,
    users: Dict.from(
        "id",
        item.users,
        (x): CartUser => ({
            ...x,
            createdAt: new Date(x.createdAt),
            paidAt: x.paidAt ? new Date(x.paidAt) : null,
        }),
    ),
});

const parseAll = (s?: ParseToRaw<State>): State => ({
    items: ((s?.items as unknown as ParseToRaw<CartState>[]) ?? []).map(parse),
});

export const History = Entity.create(
    { schemas, name: "history", version: "v1" },
    parseAll,
    () => ({ init: () => parseAll(Entity.getStorage("history") as any) }),
    {
        parse,
        view: (item: CartState) => navigate.push(link(links.cartHistory, { id: item.id })),
        get: (id: string): CartState | null => {
            const storage = (LocalStorage.get(KEY) as { items: CartState[] }) || null;
            if (storage === null) return null;
            const item = storage.items.find((item) => item.id === id);
            return item === undefined ? null : Cart.getState(item as any);
        },
        save: (item: CartState) => {
            const storage = (LocalStorage.get(KEY) as { items: CartState[] }) || { items: [] };
            LocalStorage.set(KEY, { items: [...storage.items, item] });
            return item;
        },
    },
);
