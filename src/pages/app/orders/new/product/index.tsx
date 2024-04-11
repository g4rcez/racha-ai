import { uuidv7 } from "@kripod/uuidv7";
import { BlendIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef } from "react";
import { LocalStorage } from "storage-manager-js";
import { createLocalStoragePlugin, useReducer } from "use-typed-reducer";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
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
import { Orders } from "~/store/orders.store";
import { Nullable } from "~/types";

type State = {
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
  division: DivisionType.Equality,
  price: "",
  quantity: 1,
  title: "",
  total: 0,
  users: [],
  errors: null,
};

const operations = {
  quantitySum: (a: number, user: Consumer) => a + user.quantity,
  quantityDiff: (a: number, user: Consumer) => user.quantity - a,
  noop: (a: number) => a,
};

const useProduct = (users: User[]) => {
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
          price: fromStrNumber(price || "0"),
          quantity,
          users: users.map(
            (user): Consumer => ({ ...user, consummation: "", quantity: 0 }),
          ),
        }),
    } as State,
    (get) => ({
      reset: () => emptyState,
      setError: (errors: State["errors"]) => ({ errors }),
      onValueChange: (d: DivisionType) => {
        const state = get.state();
        const fn = Product.division[d];
        return {
          division: d,
          users: fn?.({
            users: state.users,
            quantity: state.quantity,
            price: fromStrNumber(state.price || "0"),
          }),
        };
      },
      onChangeValue: (
        name: string,
        value: number,
        id: string,
        operation: (a: number, user: Consumer) => number,
      ) => ({
        users: get
          .state()
          .users.map((x) =>
            x.id === id ? { ...x, [name]: operation(value, x) } : x,
          ),
      }),
      onChangeUser: (e: React.ChangeEvent<HTMLInputElement>) => {
        const state = get.state();
        const value = e.target.value;
        const name = e.target.name;
        const id = e.target.dataset.id || "";
        return {
          users: state.users.map((x) =>
            x.id === id ? { ...x, [name]: value } : x,
          ),
        };
      },
      onSetUsers: (list: User[]) => {
        const storage = (LocalStorage.get(KEY)! || {}) as State;
        const users = Dict.from("id", storage.users ?? []);
        list.forEach((user) => {
          if (users.has(user.id)) return;
          users.set(user.id, {
            ...user,
            consummation: "",
            quantity: 0,
          });
        });
        return { users: users.toArray() };
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        return { [name]: value };
      },
    }),
    {
      postMiddleware: [createLocalStoragePlugin(KEY)],
      interceptor: [
        (state: State, prev: State) => {
          const price = fromStrNumber(state.price || "0");
          const total = price * state.quantity;
          const hasDiff = state.price !== prev.price || state.quantity !== prev.quantity;
          const users = state.users !== prev.users || hasDiff
            ? Product.division[state.division]({
                users: state.users,
                quantity: state.quantity,
                price,
              })
            : state.users;
          return { ...state, total, users };
        },
      ],
    },
  );
  useEffect(() => {
    r[1].onSetUsers(users);
  }, [users]);
  return r;
};

type ConsummationProps = {
  users: number;
  dispatch: any;
  user: Consumer;
  product: Omit<State, "consumers">;
};

const getConsummationProps = (props: ConsummationProps) => {
  if (props.product.division === DivisionType.Amount) {
    const total = props.product.quantity * fromStrNumber(props.product.price);
    return {
      mask: "money",
      max: total,
      name: "consummation",
      placeholder: "Valor de consumo...",
      title: `Valor pago por ${props.user.name}`,
      value: props.user.consummation,
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
        <button
          type="button"
          onClick={() =>
            props.dispatch.onChangeValue(
              "quantity",
              minQuantity,
              props.user.id,
              operations.quantityDiff,
            )
          }
        >
          <MinusIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            props.dispatch.onChangeValue(
              "quantity",
              minQuantity,
              props.user.id,
              operations.noop,
            )
          }
        >
          <BlendIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() =>
            props.dispatch.onChangeValue(
              "quantity",
              minQuantity,
              props.user.id,
              operations.quantitySum,
            )
          }
        >
          <PlusIcon size={16} />
        </button>
      </Fragment>
    ),
  } as const;
};

const UserConsummation = (props: ConsummationProps) => {
  return (
    <li>
      <Input
        {...getConsummationProps(props)}
        data-id={props.user.id}
        min={0}
        onChange={props.dispatch.onChangeUser}
        required
      />
    </li>
  );
};

const validate = (state: State, _e: React.FormEvent<HTMLFormElement>) => {
  let errors: State["errors"] = {};
  const sum = state.users.reduce(
    (acc, x) => acc + fromStrNumber(x.consummation),
    0,
  );
  const productTotal = fromStrNumber(state.price) * state.quantity;
  if (sum !== productTotal)
    errors.users = "A soma dos pagamentos é maior que o valor do produto";
  return errors;
};

function AppOrderNewProductPage() {
  const [state, dispatch] = Orders.use();
  const [product, action] = useProduct(state.users as User[]);
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.persist();
    const result = validate(product, e);
    if (!Is.empty(result)) {
      console.log(result);
      return action.setError(result);
    }
    dispatch.addProduct({
      category: "default",
      orderId: state.order.id,
      id: uuidv7(),
      price: product.price,
      quantity: product.quantity.toString(),
      splitType: product.division,
      title: product.title,
      total: product.total.toString(),
      type: "default",
      users: product.users,
    });
    LocalStorage.delete(KEY);
    action.reset();
    await router.push(Links.newOrder);
  };
  return (
    <main className="flex flex-col gap-8">
      <Form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Card
          title="Novo produto"
          className="flex flex-col gap-4"
          description="Anote o consumo e quem consumiu este produto"
        >
          <Input
            required
            name="title"
            value={product.title}
            title="Nome do produto"
            placeholder="Produto..."
            onChange={action.onChange}
          />
          <div className="flex flex-row gap-4 flex-nowrap">
            <Input
              required
              min={1}
              type="number"
              name="quantity"
              value={product.quantity}
              title="Quantidade"
              onChange={action.onChange}
              placeholder="Quantidade..."
            />
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
        <Card
          title="Consumo"
          description="Anote aqui quem consumiu este produto"
        >
          <section className="flex flex-wrap flex-col mb-6">
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
              <UserConsummation
                dispatch={action}
                key={user.id}
                product={product}
                user={user}
                users={product.users.length}
              />
            ))}
          </ul>
        </Card>
        <Button type="submit">Adicionar produto</Button>
      </Form>
    </main>
  );
}

AppOrderNewProductPage.getLayout = AdminLayout;

export default AppOrderNewProductPage;
