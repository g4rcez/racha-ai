import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { Store } from "~/models/store";
import { OrdersMapper } from "~/services/orders/orders.mapper";

const schemas = {
    v1: Store.validator(
        z.object({
            items: z.array(OrdersMapper.historySchema)
        })
    )
};

type State = { items: OrdersMapper.Result[] };

const parse = (item: OrdersMapper.Result): OrdersMapper.Result => {
    const validation = OrdersMapper.historySchema.safeParse(item);
    if (!validation.success) console.log("Error parsing validation", item, validation.error.issues);
    return validation.success ? validation.data : (null as any);
};

const parseAll = (s?: State): State => ({
    items: (s?.items ?? []).map(parse).toSorted((a, b) => b.order.id.localeCompare(a.order.id))
});

const setItemsStorage = (key: string, dict: Dict<string, OrdersMapper.Result>) => LocalStorage.set(key, { items: dict.toArray() });

const getItemsStorage = (key: string) => (LocalStorage.get(key) || { items: [] }) as State;

export const History = Store.create(
    { schemas, name: "history", version: "v1" },
    parseAll,
    () => ({ refresh: (state: State) => state }),
    (args) => ({
        init: () => args.getState(),
        setPaymentStatus: (orderId: string, paymentId: string, status: string) => {
            const storage = getItemsStorage(args.storageKey);
            const orders: Dict<string, OrdersMapper.Result> = Dict.from("id", storage.items ?? []);
            const item = orders.get(orderId);
            if (!item) return null;
            const order = { ...item, payments: item.payments.map((x) => (x.id === paymentId ? { ...x, status } : x)) };
            orders.set(order.id, order);
            setItemsStorage(args.storageKey, orders);
            return order;
        },
        get: (id: string, users: any[]) => {
            const storage = getItemsStorage(args.storageKey);
            const item = storage.items.find((item) => item.id === id);
            return item ? OrdersMapper.parseOrderResponse(item, users) : null;
        },
        save: (result: OrdersMapper.Result) => {
            const storage = getItemsStorage(args.storageKey);
            const carts = Dict.from("id", storage.items).set(result.order.id, result);
            setItemsStorage(args.storageKey, carts);
            return result;
        }
    })
);
