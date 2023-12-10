import { LocalStorage } from "storage-manager-js";
import { object } from "valibot";
import { Entity } from "~/models/entity";
import { link, links, navigate } from "~/router";
import { Cart, CartState } from "~/store/cart.store";
import { ParseToRaw } from "~/types";

const schemas = {
    v1: Entity.validator(object({}))
};

type State = {
    items: CartState[];
};

const KEY = "@app/history";

export const History = Entity.create(
    {
        name: "history",
        schemas,
        version: "v1"
    },
    (s?: ParseToRaw<State>) => ({ items: s?.items ?? [] }),
    () => ({}),
    {
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
        }
    }
);
