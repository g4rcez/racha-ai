import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "~/components/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Modal } from "~/components/modal";
import { Dict } from "~/lib/dict";
import { Product } from "~/models/product";
import { Cart, CartProduct } from "~/store/cart.store";
import { User } from "~/store/friends.store";

type Props = {
    product: CartProduct | null;
    onAddProduct: (product: CartProduct) => void;
    onChangeProduct: (product: CartProduct) => void;
    users: Dict<string, User>;
};

export const AnnotateProduct = (props: Props) => {
    const [product, setProduct] = useState<CartProduct | null>(props.product ?? null);
    const [visible, setVisible] = useState(!!product);
    const form = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (props.product) {
            setVisible(true);
            setProduct(props.product);
        }
    }, [props.product]);

    const onChangeVisible = (b: boolean) => {
        if (product?.name === "") {
            form.current?.reportValidity();
            return;
        }
        setVisible(b);
    };

    useEffect(() => {
        if (visible && product) props.onChangeProduct(product);
    }, [product, props.onChangeProduct]);

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
        if (product) props.onChangeProduct(product);
    };

    const onClickNewProduct = () => {
        if (props.product) return;
        const p = Cart.newProduct(props.users);
        setProduct(p);
        props.onAddProduct(p);
    };

    return (
        <Modal
            visible={visible}
            onChange={onChangeVisible}
            trigger={<Button onClick={onClickNewProduct}>Novo produto</Button>}
            title={props.product ? props.product.name : "Novo Produto"}
        >
            {product === null ? (
                <Fragment />
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
                        onChange={onChange}
                        value={product.quantity.toString()}
                        name="quantity"
                        placeholder="10 cervejas..."
                        required
                        title="Quantidade"
                        mask="int"
                    />
                    <ul className="col-span-2 space-y-4">
                        {props.users.map((user, _, index) => {
                            const average = Math.ceil(product.quantity / props.users.size);
                            const suggestion =
                                index === props.users.size - 1
                                    ? product.quantity - average * (props.users.size - 1)
                                    : average;
                            return (
                                <li className="flex flex-nowrap gap-2" key={`cart-user-${user.id}`}>
                                    {user.name}
                                    <input
                                        data-id={user.id}
                                        value={suggestion}
                                        onChange={console.log}
                                        className="w-[5ch] border-b border-muted-input bg-transparent text-center"
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
