import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "~/components/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Modal } from "~/components/modal";
import { Dict } from "~/lib/dict";
import { Is } from "~/lib/is";
import { Product } from "~/models/product";
import { Cart, CartProduct, CartUser } from "~/store/cart.store";
import { User } from "~/store/friends.store";

type Props = {
    onAddProduct: (product: CartProduct) => void;
    onChangeConsumedQuantity: (user: CartUser, product: CartProduct, quantity: number) => void;
    onChangeProduct: (product: CartProduct) => void;
    product: CartProduct | null;
    users: Dict<string, User>;
    disabled: boolean;
};

export const AnnotateProduct = (props: Props) => {
    const [product, setProduct] = useState<CartProduct | null>(props.product ?? null);
    const [visible, setVisible] = useState(!!product);
    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (props.product) {
            setVisible(true);
            return setProduct(props.product);
        }
    }, [props.product]);

    useEffect(() => {
        if (visible && product) props.onChangeProduct(product);
    }, [product, props.onChangeProduct]);

    const onChangeVisible = (b: boolean) => {
        if (product?.name === "") {
            void form.current?.reportValidity();
            return setVisible(true);
        }
        setVisible(b);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof Product;
        const value = e.target.value;
        setProduct((prev) => (prev === null ? prev : { ...prev, [name]: value }));
    };

    const onChangeMonetary = (e: React.ChangeEvent<HTMLInputElement>) => {
        const monetary = e.target.value;
        const price = Number(e.target.dataset.number) ?? 0;
        setProduct((prev) => (prev === null ? prev : { ...prev, monetary, price }));
    };

    const onSubmit = () => {
        setVisible(false);
        if (product) {
            const result = Cart.validate(product);
            if (result.isError()) return void console.error(result.error);
            if (result.isSuccess()) {
                setProduct(null);
                return props.onChangeProduct(result.success);
            }
        }
    };

    const onClickNewProduct = () => {
        const p = Cart.newProduct(props.users);
        setProduct(p);
        if (props.product) return;
        props.onAddProduct(p);
    };

    return (
        <Modal
            visible={visible}
            onChange={onChangeVisible}
            trigger={
                <Button disabled={props.disabled} onClick={onClickNewProduct}>
                    Novo produto
                </Button>
            }
            title={props.product ? props.product.name : "Novo Produto"}
        >
            {product === null ? (
                <Fragment>PRODUC</Fragment>
            ) : (
                <Form ref={form} onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
                    <Input
                        onChange={onChange}
                        value={product.name}
                        autoComplete="off"
                        autoFocus
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
                        min={1}
                        name="quantity"
                        onChange={onChange}
                        placeholder="10 cervejas..."
                        defaultValue={undefined}
                        required
                        step={1}
                        title="Quantidade"
                        type="number"
                        value={product.quantity}
                    />
                    <ul className="col-span-2 space-y-4">
                        {props.users.map((user) => {
                            const consumer = product.consumers.get(user.id)!;
                            return (
                                <li className="w-full" key={`cart-user-${user.id}`}>
                                    <Input
                                        data-id={user.id}
                                        max={product.quantity}
                                        min={0}
                                        required
                                        step={1}
                                        title={user.name}
                                        type="number"
                                        value={consumer.quantity}
                                        onChange={(e) => {
                                            if (Is.null(product)) return;
                                            const number = e.target.valueAsNumber;
                                            props.onChangeConsumedQuantity(consumer, product, number);
                                        }}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    <Button className="col-span-2" type="submit">
                        Salvar
                    </Button>
                </Form>
            )}
        </Modal>
    );
};
