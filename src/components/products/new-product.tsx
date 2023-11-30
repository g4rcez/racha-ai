import React, { useState } from "react";
import { Button } from "~/components/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Modal } from "~/components/modal";
import { Product } from "~/models/product";

export const NewProduct = () => {
    const [product, setProduct] = useState(new Product());
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof Product;
        const value = e.target.value;
        setProduct((prev) => {
            (prev as any)[name] = value;
            console.log(prev);
            return prev.clone();
        });
    };
    return (
        <Modal trigger={<Button>Novo produto</Button>} title="Novo Produto">
            <Form className="grid grid-cols-2 gap-4">
                <Input
                    onChange={onChange}
                    value={product.name}
                    autoFocus
                    required
                    name="name"
                    placeholder="Latão"
                    title="Nome do produto"
                    container="col-span-2"
                />
                <Input
                    onChange={onChange}
                    name="price"
                    value={product.price.toString()}
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
            </Form>
        </Modal>
    );
};
