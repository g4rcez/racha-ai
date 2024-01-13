import React, { Fragment, useEffect, useRef } from "react";
import { Button, ButtonGroup } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Mobile } from "~/components/mobile";
import { Dict } from "~/lib/dict";
import { clamp, diff, sum, toFraction } from "~/lib/fn";
import { Is } from "~/lib/is";
import { Product } from "~/models/product";
import { Cart, CartProduct, CartUser, Division } from "~/store/cart.store";
import { User } from "~/store/friends.store";
import { Preferences } from "~/store/preferences.store";
import { useReducer } from "~/use-typed-reducer";
import { Title } from "../typography";

type Props = {
  justMe: boolean;
  disabled: boolean;
  users: Dict<string, User>;
  product: CartProduct | null;
  onAddProduct: (product: CartProduct) => void;
  onRemoveProduct: (product: CartProduct) => void;
  onChangeProduct: (product: CartProduct) => void;
  setCurrent: (product: CartProduct | null) => void;
  onChangeConsumedQuantity: (
    user: CartUser,
    product: CartProduct,
    quantity: number,
    division: Division,
  ) => void;
};

const calculateAmount = (price: number, quantity: number) => price * quantity;

const initialState = {
  visible: false,
  product: null as CartProduct | null,
  division: Division.Equals as Division,
};

type State = typeof initialState;

type ReducerProps = { justMe: boolean; me: User };

const isEqualityMode = (quantity: number) => quantity < 1;

const updateWithEquality = (
  quantity: number,
  product: CartProduct,
): CartProduct => ({
  ...product,
  quantity,
  division: "equals" as Division,
  consumers: Dict.from(
    "id",
    product.consumers.toArray().map((consumer) => ({
      ...consumer,
      quantity: quantity / product.consumers.size,
      amount: calculateAmount(product!.price, quantity),
    })),
  ),
});

const reducers = (args: { state: () => State; props: () => ReducerProps }) => ({
  visible: (visible: boolean) => ({ visible }),
  show: () => ({ visible: true }),
  hide: () => ({ visible: false }),
  product: (product: CartProduct | null) =>
    Is.nil(product)
      ? { product: null }
      : {
          product,
          equalityMode: product.consumers
            .toArray()
            .some((x) => isEqualityMode(x.quantity)),
        },
  changeDivision: (division: Division) => {
    const state = args.state();
    if (state.product === null) return state;
    return { product: { ...state.product, division } };
  },
  onChange: (e: React.ChangeEvent<HTMLInputElement>): Partial<State> => {
    const state = args.state();
    const props = args.props();
    if (state.product === null) return state;
    const name = e.target.name as keyof Product;
    const value =
      e.target.type === "number" ? e.target.valueAsNumber : e.target.value;
    if (name !== "quantity") {
      return { product: { ...state.product, [name]: value } };
    }
    const quantity = (value as number) || 0;
    if (!props.justMe) {
      return state.division
        ? { product: updateWithEquality(quantity, state.product) }
        : { product: { ...state.product, quantity } };
    }
    const clone = state.product.consumers.clone();
    const ownUser = clone.get(props.me.id)!;
    clone.set(props.me.id, {
      ...ownUser,
      quantity,
      amount: calculateAmount(state.product.price ?? 0, quantity),
    });
    return {
      division: Division.PerConsume,
      product: { ...state.product, quantity: value as number },
    };
  },
  onChangeMonetary: (e: React.ChangeEvent<HTMLInputElement>) => {
    const state = args.state();
    if (state.product === null) return state;
    const monetary = e.target.value;
    const price = Number(e.target.dataset.number) ?? 0;
    return { product: { ...state.product, monetary, price } };
  },
  onSplitByEquality: () => {
    const state = args.state();
    if (Is.nil(state.product)) return state;
    const consumers = state.product.consumers.toArray();
    const quantity = state.product.quantity / consumers.length;
    return {
      equalityMode: isEqualityMode(quantity),
      product: {
        ...state.product,
        division: Division.Equals,
        consumers: Dict.from(
          "id",
          consumers.map((x) => ({
            ...x,
            quantity,
            amount: calculateAmount(state.product?.price!, quantity),
          })),
        ),
      },
    };
  },
  onClickQuantity: (e: React.MouseEvent<HTMLButtonElement>): Partial<State> => {
    const state = args.state();
    if (Is.nil(state.product)) return state;
    const operation = e.currentTarget.dataset.operation === "+" ? sum : diff;
    const quantity = clamp(
      0,
      operation(Number(state.product.quantity), 1),
      Number.MAX_SAFE_INTEGER,
    );
    const props = args.props();
    if (!props.justMe)
      return {
        product: state.division
          ? updateWithEquality(quantity, state.product)
          : { ...state.product, quantity },
      };
    return {
      product: {
        ...state.product,
        quantity,
        consumers: state.product.consumers.clone().set(props.me.id, {
          ...state.product.consumers.get(props.me.id)!,
          quantity,
        }),
      },
    };
  },
});

export const AnnotateProduct = (props: Props) => {
  const form = useRef<HTMLFormElement>(null);
  const [me] = Preferences.use((state) => state.user);
  const [state, dispatch] = useReducer(initialState, reducers, {
    me,
    justMe: props.justMe,
  });

  useEffect(() => {
    if (props.product) {
      dispatch.show();
      return dispatch.product(props.product);
    }
  }, [props.product]);

  useEffect(() => {
    if (state.visible && state.product) {
      if (state.product.name !== "") props.onChangeProduct(state.product);
    }
  }, [state.product, props.onChangeProduct]);

  const onChangeVisible = (b: boolean) => {
    if (!b) props.setCurrent(null);
    if (state.product?.name === "") {
      dispatch.hide();
      return props.onRemoveProduct(state.product);
    }
    dispatch.visible(b);
  };

  const onClickNewProduct = () => {
    const users: Dict<string, CartUser> = props.justMe
      ? new Dict<string, CartUser>([
          [me.id, { ...Cart.newUser(me), quantity: 1 }],
        ])
      : new Dict<string, CartUser>(
          props.users.map((x) => [x.id, Cart.newUser(x)]),
        );
    dispatch.product(Cart.newProduct(users));
  };

  const onSubmit = () => {
    const product = state.product;
    if (Is.nil(product)) {
      return;
    }
    const consumers = product.consumers.toArray();
    const result = Cart.validate({
      ...product,
      quantity: Number(product.quantity),
      createdAt: product.createdAt.toISOString(),
      consumers: consumers.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt).toISOString(),
      })),
    });
    if (result.isError()) {
      dispatch.hide();
      return void console.error(result.error);
    }
    if (result.isSuccess()) {
      dispatch.hide();
      dispatch.product(null);
      return props.onChangeProduct(result.success);
    }
  };

  const product = state.product;

  return (
    <Drawer open={state.visible} onChange={onChangeVisible}>
      <Drawer.Trigger asChild>
        <Button disabled={props.disabled} onClick={onClickNewProduct}>
          Novo produto
        </Button>
      </Drawer.Trigger>
      <Drawer.Content className="overflow-y-auto">
        <Fragment>
          {product === null ? null : (
            <Fragment>
              <Drawer.Title>
                {props.product || product
                  ? props.product?.name || product?.name || "---"
                  : "Novo Produto"}
              </Drawer.Title>
              <Form
                ref={form}
                onSubmit={onSubmit}
                className="grid grid-cols-2 gap-4 pb-12"
              >
                <Input
                  onChange={dispatch.onChange}
                  value={product.name}
                  autoComplete="off"
                  autoFocus={!Mobile.use()}
                  required
                  name="name"
                  placeholder="Latão"
                  title="Nome do produto"
                  container="col-span-2"
                />
                <Input
                  onChange={dispatch.onChangeMonetary}
                  name="monetary"
                  value={product.monetary}
                  placeholder="R$ 5,98"
                  required
                  title="Preço"
                  mask="money"
                />
                <Input
                  required
                  name="quantity"
                  onChange={dispatch.onChange}
                  placeholder="10 cervejas..."
                  title="Quantidade"
                  type="number"
                  value={product.quantity}
                  left={
                    <Button
                      data-operation="-"
                      onClick={dispatch.onClickQuantity}
                      className="text-body"
                      size="small"
                      theme="transparent"
                    >
                      -
                    </Button>
                  }
                  right={
                    <Button
                      data-operation="+"
                      onClick={dispatch.onClickQuantity}
                      className="text-body"
                      size="small"
                      theme="transparent"
                    >
                      +
                    </Button>
                  }
                />
                <section className="empty:hidden flex gap-2 py-2 empty:py-0 flex-col empty:h-0 col-span-2">
                  {props.justMe ? null : (
                    <Fragment>
                      <Title>Vamos rachar?</Title>
                      <p className="text-sm">
                        Escolha entre divisão igual para todos ou inserir
                        manualmente o consumo de cada um
                      </p>
                      <ButtonGroup
                        active={product.division}
                        buttons={[
                          {
                            name: Division.Equals,
                            children: "Igual",
                            onClick: dispatch.onSplitByEquality,
                          },
                          {
                            name: Division.PerConsume,
                            children: "Por consumo",
                            onClick: () =>
                              dispatch.changeDivision(Division.PerConsume),
                          },
                        ]}
                      />
                    </Fragment>
                  )}
                </section>
                <ul className="col-span-2 space-y-4">
                  {props.users.map((user) => {
                    const consumer = product.consumers.get(user.id) ?? null;
                    if (
                      Is.nil(consumer) ||
                      (props.users.size === 1 && props.justMe)
                    )
                      return null;

                    const onChange = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      if (Is.null(product)) return;
                      const number = Number(e.target.valueAsNumber);
                      props.onChangeConsumedQuantity(
                        consumer,
                        product,
                        number,
                        state.division,
                      );
                    };

                    const onChangeByOperation = (
                      e: React.MouseEvent<HTMLButtonElement>,
                    ) => {
                      if (state.product === null) return;
                      const isSum = e.currentTarget.dataset.operation === "+";
                      const operation = isSum ? sum : diff;
                      const c = state.product.consumers
                        .toArray()
                        .filter((x) => x.quantity > 0).length;
                      const quantity =
                        state.division === Division.PerConsume
                          ? 1
                          : state.product.quantity /
                            (Math.max(c, 1) +
                              (consumer.quantity === 0 && isSum ? 1 : 0));
                      const calc = operation(consumer.quantity, quantity);
                      const result = clamp(0, calc, product.quantity);
                      props.onChangeConsumedQuantity(
                        consumer,
                        product,
                        result,
                        state.division,
                      );
                    };

                    return (
                      <li className="w-full" key={`cart-user-${user.id}`}>
                        <Input
                          min={0}
                          required
                          title={user.name}
                          data-id={user.id}
                          onChange={onChange}
                          max={product.quantity}
                          type={state.division ? "text" : "number"}
                          readOnly={state.division === Division.Equals}
                          step={state.division ? undefined : 0.000000000000001}
                          value={
                            user.id === me.id && props.justMe
                              ? product.quantity
                              : state.division === Division.Equals
                                ? toFraction(consumer.quantity)
                                : consumer.quantity
                          }
                          left={
                            <Button
                              data-operation="-"
                              onClick={onChangeByOperation}
                              className="text-body"
                              size="small"
                              theme="transparent"
                            >
                              -
                            </Button>
                          }
                          right={
                            <Button
                              data-operation="+"
                              onClick={onChangeByOperation}
                              className="text-body"
                              size="small"
                              theme="transparent"
                            >
                              +
                            </Button>
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
                <Drawer.Close asChild>
                  <Button className="col-span-2" type="submit">
                    Salvar
                  </Button>
                </Drawer.Close>
              </Form>
            </Fragment>
          )}
        </Fragment>
      </Drawer.Content>
    </Drawer>
  );
};
