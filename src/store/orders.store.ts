import { uuidv7 } from "@kripod/uuidv7";
import React from "react";
import { z } from "zod";
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
  payments: z.array(OrdersMapper.payment),
});

const orderWithPaymentItems = Store.validator(schema);

type State = z.infer<typeof schema>;

export const Orders = Store.create(
  {
    name: "orders",
    version: "v1",
    schemas: { v1: orderWithPaymentItems },
  },
  (state?: Partial<State>): State => ({
    users: state?.users || [],
    payments: state?.payments || [],
    items: state?.items || [],
    order: {
      category: state?.order?.category || "",
      couvert: state?.order?.couvert || "",
      createdAt: state?.order?.createdAt
        ? new Date(state?.order.createdAt)
        : new Date(),
      currencyCode: state?.order?.currencyCode || "",
      id: state?.order?.id || uuidv7(),
      lastUpdatedAt: state?.order?.lastUpdatedAt
        ? new Date(state?.order?.lastUpdatedAt)
        : "",
      metadata: state?.order?.metadata || {
        couvert: 0,
        additional: 0,
        consumers: 0,
        names: {},
        percentAdditional: 0,
      },
      ownerId: state?.order?.ownerId || "",
      status: state?.order?.status || "",
      tip: state?.order?.tip || "",
      title: state?.order?.title || "",
      total: state?.order?.total || 0,
      type: state?.order?.type || "",
    },
  }),
  (get) => ({
    init: (callback: (order: State["order"]) => State["order"]) => {
      const state = get.state();
      const previous = state.order;
      const me = Preferences.getCurrentState().user;
      const users = state.users.some((x) => x.id === me.id)
        ? state.users
        : [me, ...state.users];
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
          [name]: type === "checkbox" ? checked : value,
        },
      };
    },
    onCheckUser: (e: React.ChangeEvent<HTMLInputElement>) => {
      const id = e.target.name;
      const checked = e.target.checked;
      const state = get.state();
      const users = state.users;
      if (!checked)
        return {
          users: users.filter((user) => user.id !== id),
        };
      const user = Friends.getUserById(id);
      return user ? { users: [...users, user] } : state;
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
    addProduct: (
      product: Hide<OrderItemProduct, "productId" | "ownerId" | "createdAt">,
    ) => {
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
          type: product.type,
        }),
      );
      return {
        items: get.state().items.concat(items as any as OrdersMapper.OrderItem),
      };
    },
  }),
  {
    onSubmit: async (state: State) =>
      OrdersMapper.splitBills(
        state.order,
        state.items.map(OrdersMapper.parseProduct),
      ),
  },
);
