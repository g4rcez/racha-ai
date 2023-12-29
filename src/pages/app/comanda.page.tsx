import { Trash2Icon } from "lucide-react";
import React from "react";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { AnnotateProduct } from "~/components/products/annotate-product";
import { SectionTitle, Title } from "~/components/typography";
import { SelectConsumerFriends } from "~/components/users/friends";
import { i18n } from "~/i18n";
import { Cart } from "~/store/cart.store";
import { Preferences } from "~/store/preferences.store";

export default function ComandaPage() {
    const [state, dispatch] = Cart.use();
    const [me] = Preferences.use((x) => x.user);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const submitter = ((e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement)?.value;
        if (submitter === "submit") Cart.onSubmit(state);
    };

    return (
        <main className="pb-8">
            <Title className="font-bold">{state.title}</Title>
            <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <Input
                    required
                    name="title"
                    title="Nome do bar"
                    value={state.title}
                    placeholder="Meu bar..."
                    onChange={dispatch.onChange}
                />
                <section className="flex flex-col gap-2">
                    <SectionTitle titleClassName="text-2xl" title="Quem tá na mesa?">
                        Aqui você irá selecionar todos os que irão dividir a conta com você.
                    </SectionTitle>
                    <SelectConsumerFriends friends={state.users} onChangeFriends={dispatch.onChangeFriends} />
                    <ul className="space-y-4">
                        {state.users.map((user) => {
                            const i = user.id === me.id;
                            return (
                                <li
                                    key={`${user.id}-comanda-list`}
                                    className={`flex items-center justify-between ${i ? "text-main-bg" : ""}`}
                                >
                                    <span className="text-lg">
                                        {user.name}
                                        {i ? " - Eu" : ""}
                                    </span>
                                    {i ? null : (
                                        <Button onClick={() => dispatch.removeUser(user)} theme="danger" size="small">
                                            <Trash2Icon />
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
                <section className="flex flex-col gap-2">
                    <SectionTitle titleClassName="text-2xl" title="Produtos">
                        Anote aqui todos os produtos e seus consumidores
                    </SectionTitle>
                    <AnnotateProduct
                        onAddProduct={dispatch.addProduct}
                        onChangeConsumedQuantity={dispatch.onChangeConsumedQuantity}
                        onChangeProduct={dispatch.onChangeProduct}
                        product={state.currentProduct}
                        users={state.users}
                        disabled={state.users.size === 0}
                    />
                    <ul className="space-y-4">
                        {state.products.map((product) => (
                            <li className="flex flex-col items-center justify-between" key={`product-${product.id}`}>
                                <span className="flex w-full items-center justify-between">
                                    <button
                                        onClick={() => dispatch.setCurrent(product)}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <div className="text-left">
                                            <span className="text-xl">{product.name || "-"}</span>
                                            <span className="flex gap-2 text-lg">
                                                <span>{i18n.format.money(product.price)}</span>
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
                                <ul className="mt-2 w-full space-y-1">
                                    {product.consumers.map((consumer) => (
                                        <li key={`consumer-item-${consumer.id}`}>
                                            {consumer.name} - {consumer.quantity} - {i18n.format.money(consumer.amount)}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="flex flex-wrap gap-2">
                    <SectionTitle titleClassName="text-2xl" title="Extras">
                        Vai pagar a gorjeta do garçom ou couvert artístico?
                    </SectionTitle>
                    <div className="flex flex-wrap gap-2">
                        <Checkbox checked={state.hasAdditional} onChange={dispatch.onChange} name="hasAdditional">
                            Vai pagar a gorjeta?
                        </Checkbox>
                        {state.hasAdditional ? (
                            <Input
                                mask="percent"
                                name="additional"
                                onChange={dispatch.onChange}
                                placeholder="10%"
                                required
                                title="Quantos % de gorjeta?"
                                value={state.additional}
                            />
                        ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Checkbox checked={state.hasCouvert} onChange={dispatch.onChange} name="hasCouvert">
                            Couvert artístico por pessoa?
                        </Checkbox>
                        {state.hasCouvert ? (
                            <Input
                                mask="money"
                                name="couvert"
                                onChange={dispatch.onChange}
                                placeholder="R$ 10,00"
                                required
                                title="Qual o valor do couvert?"
                                value={state.couvert}
                            />
                        ) : null}
                    </div>
                </section>
                <Button name="submit" value="submit" type="submit">
                    Fecha a conta aí
                </Button>
            </Form>
        </main>
    );
}
