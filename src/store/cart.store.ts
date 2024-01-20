import { uuidv7 } from "@kripod/uuidv7";
import { ChangeEvent } from "react";
import { z } from "zod";
import { FormError } from "~/components/form/form";
import { i18n } from "~/i18n";
import { Dict } from "~/lib/dict";
import { Either } from "~/lib/either";
import { sum } from "~/lib/fn";
import { Is } from "~/lib/is";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { Friends, User } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { ParseToRaw } from "~/types";

export type CartUser = User & {
  amount: number;
  quantity: number;
  paidAt: Date | null;
};

export enum Division {
  Equals = "equals",
  Percent = "percent",
  Absolute = "absolute",
  PerConsume = "perConsume",
}

export type CartProduct = Product & {
  consumers: Dict<string, CartUser>;
  division: Division;
};

export type Metadata = Partial<{
  location: any;
  description: string;
  avatar: string;
}>;

export type CartState = Entity.New<{
  title: string;
  justMe: boolean;
  createdAt: Date;
  couvert: string;
  finishedAt: Date;
  additional: string;
  metadata?: Metadata;
  hasCouvert: boolean;
  hasAdditional: boolean;
  users: Dict<string, CartUser>;
  currentProduct: CartProduct | null;
  products: Dict<string, CartProduct>;
  type: Division;
}>;

const product = Product.schema.extend({
  division: z.nativeEnum(Division).optional().default(Division.Equals),
  consumers: z.array(
    Friends.schema.extend({ amount: z.number(), quantity: z.number() }),
  ),
});

const defaultSchema = z.object({
  type: z.string(),
  title: z.string(),
  couvert: z.string(),
  justMe: z.boolean(),
  id: z.string().uuid(),
  additional: z.string(),
  currentProduct: product,
  hasCouvert: z.boolean(),
  hasAdditional: z.boolean(),
  products: z.array(product),
  createdAt: Entity.dateSchema,
  finishedAt: Entity.dateSchema,
  users: z.array(Friends.schema),
});

const schemas = {
  v1: Entity.validator(defaultSchema),
  v2: Entity.validator(
    defaultSchema.extend({
      justMe: z.boolean(),
      metadata: z
        .object({ location: z.any(), description: z.string() })
        .partial()
        .default({}),
      users: z.array(
        Friends.schema.extend({
          paidAt: Entity.dateSchema.nullable().default(null),
        }),
      ),
    }),
  ),
};

const newUser = (user: User | CartUser): CartUser => ({
  ...user,
  paidAt: null,
  amount: (user as any)?.amount || 0,
  quantity: (user as any)?.quantity || 0,
});

const splitAccountValue = {
  [Division.PerConsume]: (
    state: CartState,
    user: CartUser,
    product: CartProduct,
    quantity: number,
  ): Partial<CartState> => {
    const userAmount = product.price * quantity;
    const consumers = product.consumers.clone();
    const newUser = { ...user, quantity, amount: userAmount };
    consumers.set(user.id, newUser);
    const cartProduct = { ...product, consumers };
    const products = new Dict(state.products);
    products.set(cartProduct.id, cartProduct);
    return { currentProduct: cartProduct, products };
  },
  [Division.Equals]: (
    state: CartState,
    user: CartUser,
    product: CartProduct,
    quantity: number,
  ): Partial<CartState> => {
    const consumers = product.consumers.toArray();
    const withConsume = consumers.filter((x) =>
      x.id === user.id ? quantity > 0 : x.quantity > 0,
    );
    const splitQuantity = product.quantity / withConsume.length;
    const total = product.price * splitQuantity;
    const newProduct: CartProduct = {
      ...product,
      consumers: Dict.from(
        "id",
        consumers.map((consumer) => {
          if (consumer.id === user.id)
            return { ...consumer, quantity, amount: product.price * quantity };
          if (consumer.quantity === 0)
            return { ...consumer, quantity: 0, amount: 0 };
          return { ...consumer, amount: total, quantity: splitQuantity };
        }),
      ),
    };
    const products = new Dict(state.products);
    products.set(newProduct.id, newProduct);
    return { currentProduct: newProduct, products };
  },
};

export const Cart = Entity.create(
  { name: "cart", version: "v2", schemas },
  (storage?: ParseToRaw<CartState>): CartState => ({
    id: storage?.id ?? uuidv7(),
    justMe: storage?.justMe ?? false,
    title: storage?.title ?? "",
    hasAdditional: storage?.hasAdditional ?? true,
    createdAt: storage?.createdAt ? new Date(storage.createdAt) : new Date(),
    finishedAt: storage?.finishedAt ? new Date(storage.finishedAt) : new Date(),
    additional: storage?.additional ?? i18n.format.percent(0.1),
    hasCouvert: storage?.hasCouvert ?? false,
    couvert: storage?.couvert ?? i18n.format.money(10),
    currentProduct: null,
    type: storage?.type ?? Division.PerConsume,
    users: new Dict(
      storage?.users.map((x) => [
        x.id,
        {
          ...x,
          createdAt: new Date(x.createdAt),
          paidAt: x.paidAt ? new Date(x.paidAt) : null,
        },
      ]),
    ),
    products: new Dict(
      storage?.products.map((product) => [
        product.id,
        {
          ...product,
          createdAt: new Date(product.createdAt),
          consumers: new Dict(
            product.consumers.map((user) => [
              user.id,
              { ...user, createdAt: new Date(user.createdAt) },
            ]),
          ),
        },
      ]),
    ),
  }),
  (get) => {
    const merge = (s: Partial<CartState>) => ({ ...get.state(), ...s });
    return {
      set: merge,
      setCurrent: (product: CartProduct | null) =>
        merge({ currentProduct: product }),
      removeProduct: (product: CartProduct) =>
        merge({ products: new Dict(get.state().products).remove(product.id) }),
      addProduct: (product: CartProduct) =>
        merge({
          currentProduct: product,
          products: new Dict(get.state().products).set(product.id, product),
        }),
      onChangeUsername: (id: string, name: string) => {
        const state = get.state();
        const users = Dict.from(
          "id",
          state.users.arrayMap((x) => {
            if (x.id === id) {
              const user = { ...x, name };
              Friends.action.update(user);
              return user;
            }
            return x;
          }),
        );
        return { users };
      },
      removeUser: (user: User) => {
        const state = get.state();
        const id = user.id;
        const products = new Dict<string, CartProduct>(
          state.products.arrayMap((product) => [
            product.id,
            { ...product, consumers: product.consumers.clone().remove(id) },
          ]),
        );
        if (state.currentProduct) {
          const p = { ...state.currentProduct };
          p.consumers = p.consumers.clone().remove(id);
          const users = new Dict(get.state().users).remove(user.id);
          return merge({ users, products, currentProduct: p });
        }
        return merge({
          users: new Dict(get.state().users).remove(user.id),
          products,
        });
      },
      onAddFriend: (user: CartUser, justMe: boolean = false) => {
        if (justMe)
          return merge({ users: new Dict([[user.id, user]]), justMe });
        const state = get.state();
        const dict = new Dict(state.users);
        const products = state.products.clone();
        products.forEach((product) => product.consumers.set(user.id, user));
        return merge({ users: dict.set(user.id, user), justMe, products });
      },
      onRemoveFriend: (user: CartUser) =>
        merge({ users: new Dict(get.state().users).remove(user.id) }),
      onChangeProduct: (product: CartProduct) => {
        const state = get.state();
        console.log(product);
        return merge({
          products: new Dict(state.products).clone().set(product.id, {
            ...product,
            consumers: new Dict(
              product.consumers.arrayMap((consumer) => [
                consumer.id,
                {
                  ...consumer,
                  amount:
                    (state.justMe ? product.quantity : consumer.quantity) *
                    product.price,
                },
              ]),
            ),
          }),
        });
      },
      onChangeBonus: (n: number) =>
        merge({ additional: i18n.format.percent(n) }),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        const type = e.target.type;
        if (type === "checkbox") {
          const checked = e.target.checked;
          return merge({ [name]: checked });
        }
        return merge({ [name]: value });
      },
      onChangeConsumedQuantity: (
        user: CartUser,
        product: CartProduct,
        quantity: number,
        division: Division,
      ) =>
        Is.keyof(splitAccountValue, division)
          ? merge(
              splitAccountValue[division](get.state(), user, product, quantity),
            )
          : get.state(),
    };
  },
  {
    newUser,
    newProduct: (consumers: Dict<string, CartUser>): CartProduct => ({
      ...Product.create(),
      consumers: new Dict(consumers.arrayMap((x) => [x.id, newUser(x)])),
      division: Division.PerConsume,
    }),
    onSubmit: (ownerId: string, state: CartState) => {
      const now = new Date();
      History.save(ownerId, {
        ...state,
        createdAt: now,
        finishedAt: now,
        currentProduct: null,
      });
      Cart.clearStorage();
      return History.view(state.id);
    },
    productWarning: (product: CartProduct): boolean => {
      const quantitySum = product.consumers
        .toArray()
        .reduce((acc, el) => sum(acc, el.quantity), 0);
      const diff = Math.abs(quantitySum - product.quantity);
      return diff > 0.2;
    },
    validate: (cartProduct: ParseToRaw<CartProduct>) => {
      const validated = product.safeParse(cartProduct);
      const messages: FormError[] = [];
      const consumers = Array.from(cartProduct.consumers.values());
      const exceededPayers = consumers.filter(
        (x) => x.quantity > cartProduct.quantity,
      );
      if (exceededPayers.length > 0) {
        exceededPayers.forEach((payer) =>
          messages.push({
            path: `consumers["${payer.name}"]`,
            message: "Excedeu o limite de produtos",
          }),
        );
      }
      const diffSum = consumers.reduce((acc, el) => acc + el.quantity, 0);
      if (diffSum !== cartProduct.quantity) {
        messages.push({
          path: "?",
          message: "A soma de consumo está incorreta",
        });
      }
      if (!validated.success) {
        messages.push(
          ...validated.error.issues.map(
            (error): FormError => ({
              message: error.message,
              path: error.path?.join(".") ?? "",
            }),
          ),
        );
        return Either.error(messages);
      }
      const p = validated.data;
      return Either.success<CartProduct>({
        ...p,
        createdAt: p.createdAt || new Date(),
        consumers: Dict.from("id", p.consumers),
      });
    },
  },
);
