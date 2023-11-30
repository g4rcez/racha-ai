import { PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/button";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { NewProduct } from "~/components/products/new-product";
import { Title } from "~/components/typography";
import { i18n } from "~/i18n";
import { Cart } from "~/models/cart";
import { Product } from "~/models/product";
import { User } from "~/models/user";
import { createStorageMiddleware } from "~/store/middleware";
import { useReducer } from "~/use-typed-reducer";

const schema = z
    .object({
        name: z.string(),
        products: z.array(Product.schema).transform((list) => list.map((x) => new Product(x))),
        users: z.array(User.schema).transform((list) => list.map((x) => new User(x)))
    })
    .default(new Cart({ users: [new User()], products: [new Product()] }));

const storage = createStorageMiddleware("cart", { v1: schema }, "v1");

const sorter = <T extends { id: string }>(a: T, b: T) => b.id.localeCompare(a.id);

const middlewares = [storage.middleware];

export default function ComandaPage() {
    const [cart, dispatch] = useReducer(
        storage.get() as Cart,
        (get) => ({
            updateProduct: (product: Product) => {
                const cart = get.state().clone();
                cart.updateProduct(product);
                return cart;
            },
            addProduct: () => {
                const cart = get.state().clone();
                cart.newProduct();
                return cart;
            },
            updateUser: (user: User) => {
                const cart = get.state().clone();
                cart.updateUser(user);
                return cart;
            },
            addUser: () => {
                const cart = get.state().clone();
                cart.newUser();
                return cart;
            }
        }),
        undefined,
        middlewares
    );
    const friends = cart.users.toSorted(sorter);
    const products = cart.products.toSorted(sorter);

    return (
        <main className="flex w-full flex-col gap-6">
            <Title>Comanda</Title>
            <section className="flex flex-col gap-4">
                <Title className="text-xl">Amigos</Title>
                <Button onClick={dispatch.addUser} icon={<PlusIcon />}>
                    Novo amigo
                </Button>
                <ul className="grid grid-cols-1 gap-3">
                    {friends.map((friend) => {
                        return (
                            <li key={friend.id}>
                                <Form onSubmit={dispatch.addUser} className="flex flex-nowrap gap-2 items-end">
                                    <Input
                                        autoFocus
                                        required
                                        placeholder="Nome do amigo aqui..."
                                        title="Nome do amigo"
                                        value={friend.name}
                                        onChange={(e) => {
                                            const clone = friend.clone();
                                            clone.name = e.target.value;
                                            dispatch.updateUser(clone);
                                        }}
                                    />
                                    <Button
                                        theme="danger"
                                        icon={<Trash2Icon absoluteStrokeWidth strokeWidth={2} />}
                                    ></Button>
                                </Form>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <section className="flex flex-col gap-3">
                <Title className="text-xl">Produtos</Title>
                <NewProduct />
            </section>
            <section>
                <Title className="text-xl">Valores</Title>
                <ul>
                    {products.map((product) => {
                        const total = i18n.format.money(product.quantity * product.price);
                        return (
                            <li key={`${product.id}-order`}>
                                <Title className="text-lg">{product.name}</Title>
                                <p>Valor total: {total}</p>
                                <ul>
                                    {cart.users.map((user, index) => {
                                        const t = product.quantity / cart.users.length;
                                        const productsConsume = Math.round(t);
                                        const p =
                                            index === cart.users.length - 1
                                                ? productsConsume > t
                                                    ? productsConsume - 1
                                                    : productsConsume
                                                : productsConsume;
                                        const totalPerUser = p * product.price;
                                        return (
                                            <li key={`${user.id}-order`}>
                                                {user.name} {"=>"}
                                                {p}
                                                {"=>"}
                                                {i18n.format.money(totalPerUser)}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </main>
    );
}
