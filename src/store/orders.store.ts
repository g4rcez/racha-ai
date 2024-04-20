import { uuidv7 } from "@kripod/uuidv7";
import React from "react";
import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { Dict } from "~/lib/dict";
import { Hide } from "~/models/globals";
import { Product } from "~/models/product";
import { Store } from "~/models/store";
import { OrdersMapper } from "~/services/orders/orders.mapper";
import { Friends, type User } from "~/store/friends.store";
import { Preferences } from "~/store/preferences.store";

export type Consumer = User & { consummation: string; quantity: number };

export type OrderItemProduct = OrdersMapper.OrderItem & {
    users: Consumer[];
};

const schema = z.object({
    order: OrdersMapper.schema,
    users: z.array(Friends.schema),
    items: z.array(OrdersMapper.orderItem),
    payments: z.array(OrdersMapper.payment)
});

const orderWithPaymentItems = Store.validator(schema);

export type OrderState = z.infer<typeof schema>;

const emptyState = (): OrderState => ({
    users: [],
    payments: [],
    items: [],
    order: {
        category: "",
        couvert: "",
        createdAt: "",
        currencyCode: "BRL",
        id: uuidv7(),
        lastUpdatedAt: null,
        ownerId: "",
        status: "",
        tip: "",
        title: "",
        total: "",
        type: "",
        metadata: { couvert: 0, additional: 0, consumers: 0, base: 0, products: {} }
    }
});

export const Orders = Store.create(
    {
        name: "orders",
        version: "v1",
        schemas: { v1: orderWithPaymentItems }
    },
    (state?: Partial<OrderState>): OrderState => ({
        users: state?.users || [],
        payments: state?.payments || [],
        items: state?.items || [],
        order: {
            category: state?.order?.category || "",
            couvert: state?.order?.couvert || "",
            createdAt: state?.order?.createdAt ? new Date(state?.order.createdAt).toISOString() : new Date().toISOString(),
            currencyCode: state?.order?.currencyCode || "",
            id: state?.order?.id || uuidv7(),
            lastUpdatedAt: state?.order?.lastUpdatedAt ? new Date(state?.order?.lastUpdatedAt).toISOString() : "",
            metadata: state?.order?.metadata || { couvert: 0, additional: 0, consumers: 0, base: 0, products: {} },
            ownerId: state?.order?.ownerId || "",
            status: state?.order?.status || "",
            tip: state?.order?.tip || "",
            title: state?.order?.title || "",
            total: state?.order?.total || "",
            type: state?.order?.type || ""
        }
    }),
    (get) => ({
        reset: emptyState,
        init: (callback: (order: OrderState["order"]) => OrderState["order"]) => {
            const state = get.state();
            const previous = state.order;
            const me = Preferences.getCurrentState().user;
            const dict = Dict.from("id", state.users);
            const users = dict.set(me.id, { ...dict.get(me.id), ...me }).toArray();
            return { order: { ...previous, ...callback(previous) }, users };
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const name = e.target.name;
            const value = e.target.value;
            const type = e.target.type;
            const checked = e.target.checked;
            return {
                order: {
                    ...get.state().order,
                    [name]: type === "checkbox" ? checked : value
                }
            };
        },
        onCheckUser: (e: React.ChangeEvent<HTMLInputElement>) => {
            const id = e.target.name;
            const checked = e.target.checked;
            const state = get.state();
            const users = state.users;
            if (!checked)
                return {
                    users: users.filter((user) => user.id !== id)
                };
            const user = Friends.getUserById(id);
            if (user) return { users: [...users, user] };
            const me = Preferences.getCurrentState().user;
            if (me && me.id === id) return { users: [...users, me] };
            return state;
        },
        onAddUser: (e: React.FormEvent<HTMLFormElement>) => {
            const form = e.currentTarget;
            const input = form.elements.namedItem("name") as HTMLInputElement;
            const name = input.value;
            const user = Friends.new(name);
            Friends.action.upsert(user);
            input.focus({ preventScroll: false });
            form.reset();
            return { users: get.state().users.concat(user) };
        },
        upsertProduct: (product: Hide<OrderItemProduct, "productId" | "ownerId" | "createdAt">) => {
            const state = get.state();
            const items = product.users.map((user) =>
                Product.New({
                    category: product.category,
                    orderId: state.order.id,
                    ownerId: user.id,
                    price: product.price.toString(),
                    productId: product.id,
                    quantity: user.quantity.toString(),
                    splitType: product.splitType,
                    title: product.title,
                    total: user.consummation,
                    type: product.type
                })
            );
            const group = Dict.group("productId", state.items);
            group.set(product.id, items);
            return { items: group.toArray().flat() };
        }
    }),
    (args) => ({
        clear: () => LocalStorage.delete(args.storageKey),
        onSubmit: async (state: OrderState) => OrdersMapper.splitBills(state.order, state.items.map(OrdersMapper.parseProduct))
    })
);
