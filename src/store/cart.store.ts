import { uuidv7 } from "@kripod/uuidv7";
import { ChangeEvent } from "react";
import { array, boolean, integer, null_, number, object, safeParse, string, union, uuid } from "valibot";
import { FormError } from "~/components/form/form";
import { Dict } from "~/lib/dict";
import { Either } from "~/lib/either";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { Friends, User } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { ParseToRaw } from "~/types";

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
            additional: string(),
            couvert: string(),
            currentProduct: union([product, null_()]),
            hasAdditional: boolean(),
            hasCouvert: boolean(),
            id: string([uuid()]),
            products: array(product),
            title: string(),
            type: string(),
            users: array(Friends.schema)
        })
    )
};

export type CartState = {
    id: string;
    title: string;
    users: Dict<string, User>;
    hasAdditional: boolean;
    additional: string;
    hasCouvert: boolean;
    couvert: string;
    currentProduct: CartProduct | null;
    products: Dict<string, CartProduct>;
    type: "equals" | "percent" | "perConsume" | "absolute";
};

export const Cart = Entity.create(
    { name: "cart", version: "v1", schemas },
    (storage?: ParseToRaw<CartState>): CartState => ({
        id: storage?.id ?? uuidv7(),
        title: storage?.title ?? "Meu bar",
        hasAdditional: storage?.hasAdditional ?? true,
        additional: storage?.additional ?? "10",
        hasCouvert: storage?.hasCouvert ?? false,
        couvert: storage?.couvert ?? "R$ 10,00",
        currentProduct: null,
        type: storage?.type ?? "perConsume",
        users: new Dict<string, User>(storage?.users.map((x: User) => [x.id, x])),
        products: new Dict<string, CartProduct>(
            storage?.products.map((product) => [
                product.id,
                {
                    ...product,
                    consumers: new Dict(product.consumers.map((user) => [user.id, user]))
                }
            ])
        )
    }),
    (get) => {
        const merge = (s: Partial<CartState>) => ({ ...get.state(), ...s });
        return {
            setCurrent: (product: CartProduct | null) => merge({ currentProduct: product }),
            addProduct: (product: CartProduct) =>
                merge({ products: new Dict(get.state().products).set(product.id, product), currentProduct: product }),
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
                const type = e.target.type;
                if (type === "checkbox") {
                    const checked = e.target.checked;
                    return merge({ [name]: checked });
                }
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
        validate: (cartProduct: CartProduct) => {
            const validated = safeParse(product, cartProduct);
            const messages: FormError[] = [];
            const consumers = Array.from(cartProduct.consumers.values());
            const exceededPayers = consumers.filter((x) => x.quantity > cartProduct.quantity);
            if (exceededPayers.length > 0) {
                exceededPayers.forEach((payer) =>
                    messages.push({ path: `consumers["${payer.name}"]`, message: "Excedeu o limite de produtos" })
                );
            }
            const diffSum = consumers.reduce((acc, el) => acc + el.quantity, 0);
            if (diffSum !== cartProduct.quantity) {
                messages.push({ path: "?", message: "A soma de consumo está incorreta" });
            }
            if (!validated.success) {
                messages.push(
                    ...validated.issues.map(
                        (error): FormError => ({
                            message: error.message,
                            path: error.path?.join(".") ?? ""
                        })
                    )
                );
                return Either.error(messages);
            }
            return Either.success(validated.output as any as CartProduct);
        },
        newProduct: (consumers: Dict<string, User>): CartProduct => ({
            ...Product.create(),
            consumers: new Dict(consumers.map((x): [string, CartUser] => [x.id, { ...x, amount: 0, quantity: 0 }]))
        }),
        onSubmit: (state: CartState) => {
            History.save({ ...state, currentProduct: null });
            Cart.clearStorage();
            return History.view(state);
        }
    }
);
