import { LocalStorage } from "storage-manager-js";
import { array, boolean, date, null_, object, string, union, uuid } from "valibot";
import { Dict } from "~/lib/dict";
import { dateCoerce } from "~/lib/fn";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { link, links, navigate } from "~/router";
import { Cart, CartState } from "~/store/cart.store";
import { Friends } from "~/store/friends.store";
import { ParseToRaw } from "~/types";

const schemas = {
    v1: Entity.validator(
        object({
            items: array(
                object({
                    id: string([uuid()]),
                    title: string(),
                    users: array(Friends.schema),
                    createdAt: union([date(), dateCoerce]),
                    products: array(Product.schema),
                    currentProduct: union([array(Product.schema), null_()]),
                    additional: string(),
                    hasAdditional: string(),
                    hasCouvert: boolean(),
                    couvert: string(),
                    type: string(),
                }),
            ),
        }),
    ),
};

type State = { items: CartState[] };

const KEY = "@app/history";

const parse = (item: ParseToRaw<CartState>): CartState => {
    return {
        ...item,
        createdAt: new Date(item.createdAt),
        products: Dict.from("id", item.products) as any,
        users: Dict.from("id", item.users, (x) => ({ ...x, createdAt: new Date(x.createdAt) })),
    };
};

const parseAll = (s?: ParseToRaw<State>): State => {
    const items = (s?.items as unknown as ParseToRaw<CartState>[]) ?? [];
    return { items: items.map(parse) };
};

export const History = Entity.create(
    {
        schemas,
        name: "history",
        version: "v1",
    },
    parseAll,
    () => ({}),
    {
        parse,
        view: (item: CartState) => navigate.push(link(links.cartHistory, { id: item.id })),
        get: (id: string): CartState | null => {
            const storage = (LocalStorage.get(KEY) as { items: CartState[] }) || { items: [] };
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
