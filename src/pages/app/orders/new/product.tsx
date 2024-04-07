import { uuidv7 } from "@kripod/uuidv7";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { LocalStorage } from "storage-manager-js";
import { useReducer, createLocalStoragePlugin } from "use-typed-reducer";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { RadioGroup } from "~/components/form/radio-group";
import { i18n } from "~/i18n";
import { fromStrNumber } from "~/lib/fn";
import { Consumer } from "~/models/globals";
import { Links } from "~/router";
import type { User } from "~/store/friends.store";
import { Orders } from "~/store/orders.store";

enum DivisionType {
  Equality = "equality",
  // Amount = "amount",
  // Percent = "percent",
  // Share = "share",
  // Adjustment = "adjustment",
}

type State = {
  division: DivisionType;
  price: string;
  quantity: number;
  title: string;
  total: number;
  users: Consumer[];
};

type ProductCalculus = (args: {
  quantity: number;
  price: number;
  users: Consumer[];
}) => Consumer[];

const division = {
  [DivisionType.Equality]: (args) => {
    const users = args.users;
    const total = args.price * args.quantity;
    if (total === 0)
      return users.map((x): Consumer => ({ ...x, consummation: "" }));
    const quantity = args.quantity / users.length;
    const consummation = (quantity * args.price).toString();
    return users.map((x): Consumer => ({ ...x, consummation, quantity }));
  },
  // [DivisionType.Amount]: fnBase,
  // [DivisionType.Percent]: fnBase,
  // [DivisionType.Share]: fnBase,
  // [DivisionType.Adjustment]: fnBase,
} satisfies Record<string, ProductCalculus>;

const divisions = [
  {
    label: "Igualdade",
    description: "Igualdade",
    value: DivisionType.Equality,
  },
  // {
  //   label: "Fracionário",
  //   description: "Fracionário",
  //   value: DivisionType.Share,
  // },
  // {
  //   label: "Percentual",
  //   description: "Percentual",
  //   value: DivisionType.Percent,
  // },
  // {
  //   label: "Valor absoluto",
  //   description: "Valor absoluto",
  //   value: DivisionType.Amount,
  // },
] as const;

type Divisions = typeof divisions;

const KEY = "@app/temporary-product";

const emptyState: State = {
  division: DivisionType.Equality,
  price: "",
  quantity: 1,
  title: "",
  total: 0,
  users: [],
};

const useProduct = (users: User[]) => {
  const initial = useRef<Partial<State>>((LocalStorage.get(KEY) as any) || {});
  const d = (initial.current.division || DivisionType.Equality) as DivisionType;
  const total = initial.current.total || 0;
  const price = initial.current.price || "";
  const quantity = initial.current.quantity || 0;
  const r = useReducer(
    {
      division: d,
      price,
      quantity,
      title: initial.current.title || "",
      total,
      users:
        initial.current.users ||
        division[d]({
          price: fromStrNumber(price || "0"),
          quantity,
          users: users.map(
            (user): Consumer => ({ ...user, consummation: "", quantity: 0 }),
          ),
        }),
    } as State,
    (get) => ({
      reset: () => emptyState,
      onValueChange: (d: DivisionType) => {
        const state = get.state();
        const fn = division[d];
        return {
          division: d,
          users: fn?.({
            users: state.users,
            quantity: state.quantity,
            price: fromStrNumber(state.price || "0"),
          }),
        };
      },
      onChangeUser: () => {
        return {};
      },
      onSetUsers: (list: User[]) => {
        const storage = (LocalStorage.get(KEY)! || {}) as State;
        const emptyUsers =
          Array.isArray(storage?.users) && storage.users.length === 0;
        return !emptyUsers
          ? get.state()
          : {
              users: list.map(
                (user): Consumer => ({
                  ...user,
                  consummation: "",
                  quantity: 0,
                }),
              ),
            };
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
          const hasDiff =
            state.price !== prev.price || state.quantity !== prev.quantity;
          const users = hasDiff
            ? division[state.division]({
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

const UserConsummation = ({
  user,
  dispatch,
  product,
}: {
  user: Consumer;
  dispatch: any;
  product: Omit<State, "consumers">;
}) => {
  return (
    <li>
      <Input
        max={product.quantity}
        min={0}
        name="quantity"
        onChange={dispatch.onChangeUser}
        placeholder="Total do consumo..."
        required
        step={0.000000000000000000000001}
        title={`Consumo de ${user.name}`}
        type="number"
        value={user.quantity}
      />
    </li>
  );
};

function AppOrderNewProductPage() {
  const [state, dispatch] = Orders.use();
  const [product, action] = useProduct(state.users as User[]);
  const router = useRouter();
  const onSubmit = async () => {
    dispatch.addProduct({
      category: "default",
      orderId: state.order.id,
      id: uuidv7(),
      price: fromStrNumber(product.price),
      quantity: product.quantity,
      splitType: product.division,
      title: product.title,
      total: product.total,
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
            <RadioGroup<Divisions>
              required
              name="division"
              values={divisions}
              value={product.division}
              onValueChange={action.onValueChange}
              title="Tipo de divisão"
              ariaLabel="Tipo de divisão"
            />
          </section>
          <ul className="space-y-4">
            {product.users.map((user) => (
              <UserConsummation
                key={user.id}
                dispatch={action}
                user={user}
                product={product}
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
