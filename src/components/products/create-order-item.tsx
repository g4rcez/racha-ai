import { uuidv7 } from "@kripod/uuidv7";
import { BlendIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef } from "react";
import { LocalStorage } from "storage-manager-js";
import { createLocalStoragePlugin, useReducer } from "use-typed-reducer";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { RadioGroup } from "~/components/form/radio-group";
import { i18n } from "~/i18n";
import { Dict } from "~/lib/dict";
import { fromStrNumber } from "~/lib/fn";
import { Is } from "~/lib/is";
import { Consumer, DivisionType } from "~/models/globals";
import { Product } from "~/models/product";
import { Links } from "~/router";
import type { User } from "~/store/friends.store";
import { Orders, OrderState } from "~/store/orders.store";
import { Nullable } from "~/types";

type State = {
    id: string;
    division: DivisionType;
    price: string;
    quantity: number;
    title: string;
    total: number;
    users: Consumer[];
    errors: Nullable<Record<string, string>>;
};

const KEY = "@app/temporary-product";

const emptyState: State = {
    id: uuidv7(),
    division: DivisionType.Equality,
    price: "",
    quantity: 1,
    title: "",
    total: 0,
    users: [],
    errors: null
};

const operations = {
    quantitySum: (a: number, user: Consumer) => a + user.quantity,
    quantityDiff: (a: number, user: Consumer) => user.quantity - a,
    noop: (a: number) => a
};

const parseFromStorage = (items: OrderState["items"], users: User[]): Partial<State> => {
    if (items.length === 0) return {};
    const dict = Dict.from("id", users);
    const first = items[0]!;
    const result = items.reduce(
        (acc, el) => {
            const user = dict.get(el.ownerId)!;
            const item: Consumer = {
                id: user.id,
                name: user.name,
                quantity: fromStrNumber(el.quantity),
                consummation: el.total,
                createdAt: user.createdAt
            };
            acc.users.push(item);
            return {
                users: acc.users,
                total: acc.total + fromStrNumber(el.total),
                quantity: acc.quantity + fromStrNumber(el.quantity)
            };
        },
        { users: [] as Consumer[], quantity: 0, total: 0 }
    );
    return {
        division: first.splitType as DivisionType,
        errors: null,
        id: first.productId,
        price: first.price,
        quantity: Math.round(result.quantity),
        title: first.title,
        total: result.total,
        users: result.users
    };
};

const resetConsumers = (users: User[]) => users.map((user): Consumer => ({ ...user, consummation: "", quantity: 0 }));

const useProduct = (id: Nullable<string>, items: OrderState["items"], users: User[]) => {
    const initial = useRef<Partial<State>>((LocalStorage.get(KEY) as any) || {});
    const d = (initial.current.division || DivisionType.Equality) as DivisionType;
    const total = initial.current.total || 0;
    const price = initial.current.price || "";
    const quantity = initial.current.quantity || 0;
    const r = useReducer(
        {
            ...emptyState,
            division: d,
            price,
            quantity,
            title: initial.current.title || "",
            total,
            users:
                initial.current.users ||
                Product.division[d]({
                    quantity,
                    price: fromStrNumber(price || "0"),
                    users: resetConsumers(users)
                })
        } as State,
        (get) => ({
            reset: (users?: User[]) => ({
                ...emptyState,
                users: Array.isArray(users) ? resetConsumers(users) : emptyState.users
            }),
            set: (fn: (st: State) => State) => fn(get.state()),
            setError: (errors: State["errors"]) => ({ errors }),
            clear: () => ({
                ...get.initialState,
                id: uuidv7(),
                users: resetConsumers(get.state().users)
            }),
            onValueChange: (d: DivisionType) => {
                const state = get.state();
                const fn = Product.division[d];
                return {
                    division: d,
                    users: fn?.({
                        users: state.users,
                        quantity: state.quantity,
                        price: fromStrNumber(state.price || "0")
                    })
                };
            },
            onChangeValue: (name: string, value: number, id: string, operation: (a: number, user: Consumer) => number) => ({
                users: get.state().users.map((x) => (x.id === id ? { ...x, [name]: operation(value, x) } : x))
            }),
            onChangeUser: (e: React.ChangeEvent<HTMLInputElement>) => {
                const state = get.state();
                const value = e.target.value;
                const name = e.target.name;
                const id = e.target.dataset.id || "";
                return { users: state.users.map((user) => (user.id !== id ? user : { ...user, [name]: value })) };
            },
            onSetUsers: (list: User[], _: boolean) => {
                const storage = (LocalStorage.get(KEY)! || {}) as State;
                const users = Dict.from("id", storage.users ?? []);
                if (users.size === 0) {
                    const state = get.state();
                    const users = Product.division[state.division]({
                        users: resetConsumers(list),
                        quantity: state.quantity,
                        price: fromStrNumber(state.price)
                    });
                    return { users };
                }
                list.forEach((user) => {
                    if (users.has(user.id)) return;
                    users.set(user.id, { ...user, consummation: "", quantity: 0 });
                });
                return { users: users.toArray() };
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const name = e.target.name;
                const value = e.target.value;
                return { [name]: value };
            }
        }),
        {
            postMiddleware: [createLocalStoragePlugin(KEY)],
            interceptor: [
                (state: State, prev: State) => {
                    const price = fromStrNumber(state.price || "0");
                    const total = price * state.quantity;
                    const hasDiff = state.price !== prev.price || state.quantity !== prev.quantity;
                    const users = hasDiff
                        ? Product.division[state.division]({
                              users: state.users,
                              quantity: state.quantity,
                              price
                          })
                        : state.users;
                    return { ...state, total, users };
                }
            ]
        }
    );

    useEffect(() => {
        if (id !== null && items.length > 0) {
            return void r[1].set((state) => ({
                ...state,
                ...parseFromStorage(
                    items.filter((x) => x.productId === id),
                    users
                )
            }));
        }
        r[1].clear();
        return void r[1].onSetUsers(users, true);
    }, [id, items, users]);

    return r;
};

type ConsummationProps = { users: number; dispatch: any; user: Consumer; product: Omit<State, "consumers"> };

const getConsummationProps = (props: ConsummationProps) => {
    if (props.product.division === DivisionType.Amount) {
        const total = props.product.quantity * fromStrNumber(props.product.price);
        return {
            mask: "money",
            max: total,
            name: "consummation",
            placeholder: "Valor de consumo...",
            title: `Valor pago por ${props.user.name}`,
            value: props.user.consummation
        } as const;
    }
    const minQuantity = props.product.quantity / props.users;
    return {
        max: props.product.quantity,
        name: "quantity",
        placeholder: "Total do consumo...",
        step: 0.000000000000000000000001,
        title: `Consumo de ${props.user.name}`,
        type: "number",
        value: props.user.quantity,
        right: (
            <Fragment>
                <button type="button" onClick={() => props.dispatch.onChangeValue("quantity", minQuantity, props.user.id, operations.quantityDiff)}>
                    <MinusIcon size={16} />
                </button>
                <button type="button" onClick={() => props.dispatch.onChangeValue("quantity", minQuantity, props.user.id, operations.noop)}>
                    <BlendIcon size={16} />
                </button>
                <button type="button" onClick={() => props.dispatch.onChangeValue("quantity", minQuantity, props.user.id, operations.quantitySum)}>
                    <PlusIcon size={16} />
                </button>
            </Fragment>
        )
    } as const;
};

const UserConsummation = (props: ConsummationProps) => (
    <li>
        <Input {...getConsummationProps(props)} data-id={props.user.id} min={0} onChange={props.dispatch.onChangeUser} required />
    </li>
);

const validate = (state: State, _e: React.FormEvent<HTMLFormElement>) => {
    let errors: State["errors"] = {};
    const sum = state.users.reduce((acc, x) => acc + fromStrNumber(x.consummation), 0);
    const productTotal = fromStrNumber(state.price) * state.quantity;
    if (sum !== productTotal) errors.users = "A soma dos pagamentos é maior que o valor do produto";
    return errors;
};

export function CreateOrderItem(props: { id: Nullable<string> }) {
    const [state, dispatch] = Orders.use();
    const [product, action] = useProduct(props.id, state.items, state.users as User[]);
    const router = useRouter();

    const onReset = () => {
        LocalStorage.delete(KEY);
        action.reset(state.users as User[]);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.persist();
        const result = validate(product, e);
        if (!Is.empty(result)) {
            console.log(result);
            return action.setError(result);
        }
        dispatch.upsertProduct({
            category: "default",
            orderId: state.order.id,
            id: product.id || uuidv7(),
            price: product.price,
            quantity: Math.round(product.quantity).toString(),
            splitType: product.division,
            title: product.title,
            total: product.total.toString(),
            type: "default",
            users: product.users
        });
        onReset();
        await router.push(Links.newOrder);
    };

    return (
        <main className="flex flex-col gap-8">
            <Form onReset={onReset} onSubmit={onSubmit} className="flex flex-col gap-4">
                <Card title="Novo produto" className="flex flex-col gap-4" description="Anote o consumo e quem consumiu este produto">
                    <Input required name="title" value={product.title} title="Nome do produto" placeholder="Produto..." onChange={action.onChange} />
                    <div className="flex flex-row flex-nowrap gap-4">
                        <Input required min={1} type="number" name="quantity" value={product.quantity} title="Quantidade" onChange={action.onChange} placeholder="Quantidade..." />
                        <Input
                            required
                            mask="money"
                            name="price"
                            title="Preço"
                            value={product.price}
                            locale={i18n.language}
                            onChange={action.onChange}
                            currency={i18n.getCurrency() as any}
                            placeholder={i18n.format.money(9.99)}
                        />
                    </div>
                </Card>
                <Card title="Consumo" description="Anote aqui quem consumiu este produto">
                    <section className="mb-6 flex flex-col flex-wrap">
                        <RadioGroup<Product.Divisions>
                            required
                            name="division"
                            values={Product.divisions}
                            value={product.division}
                            onValueChange={action.onValueChange}
                            title="Tipo de divisão"
                            ariaLabel="Tipo de divisão"
                        />
                    </section>
                    <ul className="space-y-4">
                        {product.users.map((user) => (
                            <UserConsummation dispatch={action} key={user.id} product={product} user={user} users={product.users.length} />
                        ))}
                    </ul>
                </Card>
                <Button type="submit">Adicionar produto</Button>
                <Button type="reset" theme="transparent-danger">
                    Limpar produto
                </Button>
            </Form>
        </main>
    );
}
