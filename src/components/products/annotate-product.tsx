import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Mobile } from "~/components/mobile";
import { Dict } from "~/lib/dict";
import { clamp, diff, fixed, sum } from "~/lib/fn";
import { Is } from "~/lib/is";
import { Product } from "~/models/product";
import { Cart, CartProduct, CartUser } from "~/store/cart.store";
import { User } from "~/store/friends.store";
import { Preferences } from "~/store/preferences.store";

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
  ) => void;
};

const calculateAmount = (price: number, quantity: number) => price * quantity;

export const AnnotateProduct = (props: Props) => {
  const [me] = Preferences.use((state) => state.user);
  const [product, setProduct] = useState<CartProduct | null>(
    props.product ?? null,
  );
  const [visible, setVisible] = useState(!!product);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (props.product) {
      setVisible(true);
      return setProduct(props.product);
    }
  }, [props.product]);

  useEffect(() => {
    if (visible && product) {
      if (product.name !== "") props.onChangeProduct(product);
    }
  }, [product, props.onChangeProduct]);

  const onChangeVisible = (b: boolean) => {
    if (!b) props.setCurrent(null);
    if (product?.name === "") {
      setVisible(false);
      return props.onRemoveProduct(product);
    }
    setVisible(b);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Product;
    const value =
      e.target.type === "number" ? e.target.valueAsNumber : e.target.value;
    if (name !== "quantity")
      return setProduct((prev) =>
        Is.nil(prev) ? prev : { ...prev, [name]: value },
      );
    const quantity = (value as number) || 0;
    return props.justMe
      ? setProduct((prev) => {
          if (Is.nil(prev)) return null;
          const clone = prev.consumers.clone();
          const ownUser = clone.get(me.id)!;
          clone.set(me.id, {
            ...ownUser,
            quantity,
            amount: calculateAmount(product?.price ?? 0, quantity),
          });
          return { ...prev, quantity: value as number };
        })
      : setProduct((prev) => (Is.nil(prev) ? prev : { ...prev, quantity }));
  };

  const onChangeMonetary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const monetary = e.target.value;
    const price = Number(e.target.dataset.number) ?? 0;
    setProduct((prev) => (Is.nil(prev) ? prev : { ...prev, monetary, price }));
  };

  const onClickNewProduct = () => {
    const users: Dict<string, CartUser> = props.justMe
      ? new Dict<string, CartUser>([
          [me.id, { ...Cart.newUser(me), quantity: 1 }],
        ])
      : new Dict<string, CartUser>(
          props.users.map((x) => [x.id, Cart.newUser(x)]),
        );
    setProduct(Cart.newProduct(users));
  };

  const onClickQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    const operation = e.currentTarget.dataset.operation === "+" ? sum : diff;
    setProduct((prev) => {
      if (Is.nil(prev)) return null;
      const quantity = clamp(
        0,
        operation(Number(prev.quantity), 1),
        Number.MAX_SAFE_INTEGER,
      );
      return props.justMe
        ? {
            ...prev,
            quantity,
            consumers: prev.consumers
              .clone()
              .set(me.id, { ...prev.consumers.get(me.id)!, quantity }),
          }
        : { ...prev, quantity };
    });
  };

  const onSubmit = () => {
    if (product) {
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
        setVisible(false);
        return void console.error(result.error);
      }
      if (result.isSuccess()) {
        setProduct(null);
        setVisible(false);
        return props.onChangeProduct(result.success);
      }
    }
    setVisible(false);
  };

  const onSplitByEquality = () => {
    setProduct((prev) => {
      if (!prev) return null;
      const consumers = prev.consumers.toArray();
      const quantity = fixed(prev.quantity / consumers.length);
      return {
        ...prev,
        consumers: Dict.from(
          "id",
          consumers.map((x) => ({
            ...x,
            quantity,
            amount: calculateAmount(prev.price, quantity),
          })),
        ),
      };
    });
  };

  return (
    <Drawer open={visible} onChange={onChangeVisible}>
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
                className="grid grid-cols-2 gap-4"
              >
                <Input
                  onChange={onChange}
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
                  onChange={onChangeMonetary}
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
                  onChange={onChange}
                  placeholder="10 cervejas..."
                  title="Quantidade"
                  type="number"
                  value={product.quantity}
                  left={
                    <Button
                      data-operation="-"
                      onClick={onClickQuantity}
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
                      onClick={onClickQuantity}
                      className="text-body"
                      size="small"
                      theme="transparent"
                    >
                      +
                    </Button>
                  }
                />
                <section className="empty:hidden empty:h-0">
                  {props.justMe ? null : (
                    <Button onClick={onSplitByEquality}>
                      Dividir igualmente
                    </Button>
                  )}
                </section>
                <ul className="col-span-2 space-y-4">
                  {props.users.map((user) => {
                    const consumer = product.consumers.get(user.id) ?? null;
                    if (Is.nil(consumer)) return null;
                    if (props.users.size === 1 && props.justMe) return null;
                    const onChange = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      if (Is.null(product)) return;
                      const number = e.target.valueAsNumber;
                      props.onChangeConsumedQuantity(consumer, product, number);
                    };

                    const onChangeByOperation = (
                      e: React.MouseEvent<HTMLButtonElement>,
                    ) => {
                      const operation =
                        e.currentTarget.dataset.operation === "+" ? sum : diff;
                      const result = clamp(
                        0,
                        operation(consumer.quantity, 1),
                        product.quantity,
                      );
                      props.onChangeConsumedQuantity(consumer, product, result);
                    };

                    return (
                      <li className="w-full" key={`cart-user-${user.id}`}>
                        <Input
                          type="number"
                          data-id={user.id}
                          max={product.quantity}
                          onChange={onChange}
                          min={0}
                          step={0.000000000000001}
                          required
                          title={user.name}
                          value={
                            user.id === me.id && props.justMe
                              ? product.quantity
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
                <Button className="col-span-2" type="submit">
                  Salvar
                </Button>
              </Form>
            </Fragment>
          )}
        </Fragment>
      </Drawer.Content>
    </Drawer>
  );
};
