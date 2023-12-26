import { uuidv7 } from "@kripod/uuidv7";
import { ChangeEvent } from "react";
import { z } from "zod";
import { FormError } from "~/components/form/form";
import { i18n } from "~/i18n";
import { Dict } from "~/lib/dict";
import { Either } from "~/lib/either";
import { Entity } from "~/models/entity";
import { Product } from "~/models/product";
import { Friends, User } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { ParseToRaw } from "~/types";

export type CartUser = User & { amount: number; quantity: number; paidAt: Date | null };

export type CartProduct = Product & { consumers: Dict<string, CartUser> };

const product = z.object({
    ...Product.schema.shape,
    consumers: z.array(
        z.object({
            ...Friends.schema.shape,
            amount: z.number(),
            quantity: z.number().int(),
        }),
    ),
});

const defaultSchema = z.object({
    additional: z.string(),
    couvert: z.string(),
    currentProduct: product,
    title: z.string(),
    type: z.string(),
    id: z.string().uuid(),
    hasCouvert: z.boolean(),
    hasAdditional: z.boolean(),
    products: z.array(product),
    createdAt: Entity.dateSchema,
    users: z.array(Friends.schema),
});

const schemas = {
    v1: Entity.validator(defaultSchema),
    v2: Entity.validator(
        z.object({
            ...defaultSchema.shape,
            justMe: z.boolean(),
            users: z.array(z.object({ ...Friends.schema.shape, paidAt: Entity.dateSchema.nullable().default(null) })),
        }),
    ),
};

const newUser = (user: User | CartUser): CartUser => ({
    ...user,
    amount: (user as any)?.amount || 0,
    quantity: (user as any)?.quantity || 0,
    paidAt: null,
});

export type CartState = Entity.New<{
    title: string;
    justMe: boolean;
    createdAt: Date;
    couvert: string;
    additional: string;
    hasCouvert: boolean;
    hasAdditional: boolean;
    users: Dict<string, CartUser>;
    currentProduct: CartProduct | null;
    products: Dict<string, CartProduct>;
    type: "equals" | "percent" | "perConsume" | "absolute";
}>;

export const Cart = Entity.create(
    { name: "cart", version: "v2", schemas },
    (storage?: ParseToRaw<CartState>): CartState => ({
        id: storage?.id ?? uuidv7(),
        justMe: storage?.justMe ?? false,
        title: storage?.title ?? "Meu bar",
        hasAdditional: storage?.hasAdditional ?? true,
        createdAt: storage?.createdAt ? new Date(storage.createdAt) : new Date(),
        additional: storage?.additional ?? i18n.format.percent(0.1),
        hasCouvert: storage?.hasCouvert ?? false,
        couvert: storage?.couvert ?? i18n.format.money(10),
        currentProduct: null,
        type: storage?.type ?? "perConsume",
        users: new Dict(
            storage?.users.map((x) => [
                x.id,
                { ...x, createdAt: new Date(x.createdAt), paidAt: x.paidAt ? new Date(x.paidAt) : null },
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
                            {
                                ...user,
                                createdAt: new Date(user.createdAt),
                            },
                        ]),
                    ),
                },
            ]),
        ),
    }),
    (get) => {
        const merge = (s: Partial<CartState>) => ({ ...get.state(), ...s });
        return {
            setCurrent: (product: CartProduct | null) => merge({ currentProduct: product }),
            addProduct: (product: CartProduct) =>
                merge({
                    products: new Dict(get.state().products).set(product.id, product),
                    currentProduct: { ...product },
                }),
            removeProduct: (product: CartProduct) =>
                merge({ products: new Dict(get.state().products).remove(product.id) }),
            removeUser: (user: User) => merge({ users: new Dict(get.state().users).remove(user.id) }),
            onChangeFriends: (users: User[], justMe: boolean) => {
                const dict = new Dict(get.state().users);
                users.forEach((user) => dict.set(user.id, newUser(user)));
                return merge({ users: dict, justMe });
            },
            onChangeProduct: (product: CartProduct) =>
                merge({
                    products: new Dict(get.state().products).clone().set(product.id, {
                        ...product,
                        consumers: new Dict(
                            product.consumers.map((consumer) => [
                                consumer.id,
                                { ...consumer, amount: consumer.quantity * product.price },
                            ]),
                        ),
                    }),
                }),
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
            },
        };
    },
    {
        validate: (cartProduct: ParseToRaw<CartProduct>) => {
            const validated = product.safeParse(cartProduct);
            const messages: FormError[] = [];
            const consumers = Array.from(cartProduct.consumers.values());
            const exceededPayers = consumers.filter((x) => x.quantity > cartProduct.quantity);
            if (exceededPayers.length > 0) {
                exceededPayers.forEach((payer) =>
                    messages.push({ path: `consumers["${payer.name}"]`, message: "Excedeu o limite de produtos" }),
                );
            }
            const diffSum = consumers.reduce((acc, el) => acc + el.quantity, 0);
            if (diffSum !== cartProduct.quantity) {
                messages.push({ path: "?", message: "A soma de consumo está incorreta" });
            }
            if (!validated.success) {
                messages.push(
                    ...validated.error.issues.map(
                        (error): FormError => ({ message: error.message, path: error.path?.join(".") ?? "" }),
                    ),
                );
                return Either.error(messages);
            }
            return Either.success(validated.data as any as CartProduct);
        },
        newUser,
        newProduct: (consumers: Dict<string, CartUser>): CartProduct => ({
            ...Product.create(),
            consumers: new Dict(consumers.map((x) => [x.id, newUser(x)])),
        }),
        onSubmit: (state: CartState) => {
            History.save({ ...state, currentProduct: null });
            Cart.clearStorage();
            return History.view(state);
        },
    },
);
