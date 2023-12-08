import { ChangeEvent } from "react";
import { array, integer, null_, number, object, string, union } from "valibot";
import { Dict } from "~/lib/dict";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { Friends, User } from "~/store/friends.store";

export type CartUser = User & { amount: number; quantity: number };

export type CartProduct = Product & { consumers: Dict<string, CartUser> };

const product = object({
    ...Product.schema.entries,
    consumers: array(
        object({
            ...Friends.schema.entries,
            amount: number(),
            quantity: number([integer()])
        })
    )
});

const schemas = {
    v1: Entity.validator(
        object({
            title: string(),
            users: array(Friends.schema),
            currentProduct: union([product, null_()]),
            products: array(product),
            waiterTax: union([number(), null_()]),
            couvertTax: union([number(), null_()])
        })
    )
};

type State = {
    title: string;
    users: Dict<string, User>;
    currentProduct: CartProduct | null;
    products: Dict<string, CartProduct>;
    type: "equals" | "percent" | "perConsume" | "absolute";
    waiterTax: number | null;
    couvertTax: number | null;
};

export const Cart = Entity.create(
    { name: "cart", version: "v1", schemas },
    (storage?: any): State => ({
        title: "Meu bar",
        currentProduct: null,
        type: storage?.type ?? "perConsume",
        waiterTax: storage?.waiterTax ?? null,
        couvertTax: storage?.couvertTax ?? null,
        users: new Dict<string, User>(storage?.users.map((x: User) => [x.id, x])),
        products: new Dict<string, CartProduct>(
            storage?.products.map((product: CartProduct) => [
                product.id,
                {
                    ...product,
                    consumers: new Dict((product.consumers as any as CartUser[]).map((user) => [user.id, user]))
                }
            ])
        )
    }),
    (get) => {
        const merge = (s: Partial<State>) => ({ ...get.state(), ...s });
        return {
            setCurrent: (product: CartProduct | null) => merge({ currentProduct: product }),
            addProduct: (product: CartProduct) =>
                merge({ products: new Dict(get.state().products).set(product.id, product) }),
            removeProduct: (product: CartProduct) =>
                merge({ products: new Dict(get.state().products).remove(product.id) }),
            removeUser: (user: User) => merge({ users: new Dict(get.state().users).remove(user.id) }),
            onChangeFriends: (users: User[]) => {
                const dict = new Dict(get.state().users);
                users.forEach((user) => dict.set(user.id, user));
                return merge({ users: dict });
            },
            onChangeProduct: (product: CartProduct) => {
                const dict = new Dict(get.state().products);
                dict.set(product.id, product);
                return merge({ products: dict });
            },
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const name = e.target.name;
                const value = e.target.value;
                return merge({ [name]: value });
            },
            onChangeConsumedQuantity: (user: CartUser, product: CartProduct, quantity: number) => {
                const userAmount = product.price * quantity;
                const consumers = new Dict(product.consumers);
                const newUser = { ...user, quantity, amount: userAmount };
                consumers.set(user.id, newUser);
                const cartProduct = { ...product, consumers };
                const products = new Dict(get.state().products);
                products.set(cartProduct.id, cartProduct);
                return merge({ currentProduct: cartProduct, products });
            }
        };
    },
    {
        newProduct: (consumers: Dict<string, User>): CartProduct => ({
            ...Product.create(),
            consumers: new Dict(consumers.map((x): [string, CartUser] => [x.id, { ...x, amount: 0, quantity: 0 }]))
        })
    }
);
