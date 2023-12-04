import { Trash2Icon } from "lucide-react";
import { Button } from "~/components/button";
import { AnnotateProduct } from "~/components/products/annotate-product";
import { SectionTitle } from "~/components/typography";
import { SelectConsumerFriends } from "~/components/users/friends";
import { i18n } from "~/i18n";
import { Cart } from "~/store/cart.store";
import { Preferences } from "~/store/preferences.store";

export default function ComandaPage() {
    const [state, dispatch] = Cart.use();
    const [me] = Preferences.use((x) => x.user);

    return (
        <main className="flex flex-col gap-4">
            <input
                name="title"
                value={state.title}
                onChange={dispatch.onChange}
                className="block w-full border border-transparent bg-transparent text-3xl"
            />
            <section className="flex flex-col gap-4">
                <SelectConsumerFriends friends={state.users} onChangeFriends={dispatch.onChangeFriends} />
                <SectionTitle titleClassName="text-2xl" title="Pagantes">
                    Deixe aqui apenas quem vai dividir com você
                </SectionTitle>
                <ul className="space-y-4">
                    {state.users.map((user) => (
                        <li className="flex items-center justify-between" key={`${user.id}-comanda-list`}>
                            <span className="text-xl">{user.name}</span>
                            {me.id === user.id ? null : (
                                <Button onClick={() => dispatch.removeUser(user)} theme="danger" size="small">
                                    <Trash2Icon />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
            <section className="flex flex-col gap-4">
                <SectionTitle titleClassName="text-2xl" title="Produtos">
                    Anote aqui todos os produtos e seus consumidores
                </SectionTitle>
                <AnnotateProduct
                    product={state.currentProduct}
                    onAddProduct={dispatch.addProduct}
                    onChangeProduct={dispatch.onChangeProduct}
                    users={state.users}
                />
                <ul className="space-y-4">
                    {state.products.map((product) => (
                        <li className="flex flex-col items-center justify-between" key={`product-${product.id}`}>
                            <span className="flex items-center w-full justify-between">
                                <button
                                    onClick={() => dispatch.setCurrent(product)}
                                    className="flex w-full items-center justify-between"
                                >
                                    <div className="text-left">
                                        <span className="text-xl">{product.name || "-"}</span>
                                        <span className="flex gap-2 text-lg">
                                            <span>{product.monetary}</span>
                                            <span>{"*"}</span>
                                            <span>{product.quantity}</span>
                                            <span>{"="}</span>
                                            <span>{i18n.format.money(product.quantity * product.price)}</span>
                                        </span>
                                    </div>
                                </button>
                                <Button onClick={() => dispatch.removeProduct(product)} theme="danger" size="small">
                                    <Trash2Icon />
                                </Button>
                            </span>
                            <ul className="w-full mt-2 space-y-1">
                                {product.consumers.map((consumer) => (
                                    <li key={`consumer-item-${consumer.id}`}>{consumer.name} - {consumer.products} - {consumer.amount}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
