import { ExternalLinkIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Checkbox } from "~/components/form/checkbox";
import { Form } from "~/components/form/form";
import { Input } from "~/components/form/input";
import { Table, TableBody, TableCell, TableHead, TableRow } from "~/components/table";
import { i18n, useI18n } from "~/i18n";
import { Dict } from "~/lib/dict";
import { fromStrNumber } from "~/lib/fn";
import { Categories } from "~/models/categories";
import { Links } from "~/router";
import { Friends } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { Orders } from "~/store/orders.store";
import { Preferences } from "~/store/preferences.store";
import { NextPageWithLayout } from "~/types";

const InitialData = () => {
    const [state, dispatch] = Orders.use(undefined, () => {
        Orders.action.init((prev) => {
            if (!prev.currencyCode) prev.currencyCode = i18n.getCurrency()!;
            prev.category = Categories.restaurant.name;
            return { ...prev  };
        });
    });

    return (
        <Card title="Nosso role" className="flex flex-col gap-2" description="Onde foi o role com a galera?">
            <Input required name="title" form="form" title="Nome do local" value={state.order.title} onChange={dispatch.onChange} />
            {/*<Button theme="transparent" className="underline w-full text-center">*/}
            {/*  Adicionar mais informações*/}
            {/*</Button>*/}
        </Card>
    );
};

const MyFriends = () => {
    const [state] = Friends.use();
    const [order, dispatch] = Orders.use();
    const [me] = Preferences.use();
    const users = useMemo(() => Dict.from("id", order.users), [order.users]);
    const hasMe = users.has(me.user.id);
    return (
        <Card title="Quem foi a galera?" description="Marque todo mundo que vai dividir a conta com você">
            <Form onSubmit={dispatch.onAddUser}>
                <Input
                    name="name"
                    optionalText=""
                    title="Nome do amigo"
                    right={
                        <Button type="submit" theme="transparent">
                            <PlusIcon className="text-main-soft" size={18} />
                        </Button>
                    }
                />
            </Form>
            <Form>
                <ul className="mt-4 list-inside space-y-3">
                    <li key={me.user.id}>
                        <Checkbox name={me.user.id} value={me.user.id} checked={hasMe} onChange={dispatch.onCheckUser}>
                            {me.user.name} - <span className="text-main-soft">Você</span>
                        </Checkbox>
                    </li>
                    {state.users.arrayMap((user) => {
                        const checked = users.has(user.id);
                        return (
                            <li key={user.id}>
                                <Checkbox name={user.id} value={user.id} checked={checked} onChange={dispatch.onCheckUser}>
                                    {user.name}
                                </Checkbox>
                            </li>
                        );
                    })}
                </ul>
            </Form>
        </Card>
    );
};

const AdditionalCharges = () => {
    const [state, dispatch] = Orders.use();
    const [i18n] = useI18n();
    return (
        <Card title="Gorjeta e couvert" description="Vai pagar a gorjeta pro doutor?" className="flex flex-col gap-4">
            <Input name="tip" title="Gorjeta" mask="percentage" value={state.order.tip} onChange={dispatch.onChange} placeholder={i18n.format.percent(0.1)} />
            <Input name="couvert" mask="money" title="Couvert" value={state.order.couvert || undefined} onChange={dispatch.onChange} placeholder={i18n.format.money(10)} />
        </Card>
    );
};

const MyProducts = () => {
    const [state] = Orders.use();
    const products = useMemo(() => Dict.group("productId", state.items), [state.items]);
    const [i18n] = useI18n();
    return (
        <Card title="Consumo" description="Não esqueça de anotar nada pra não sair no prejuízo.">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.arrayMap((product) => {
                        const item = product[0];
                        const quantity = Math.round(product.reduce((acc, x) => fromStrNumber(x.quantity) + acc, 0));
                        const intPrice = fromStrNumber(item.price);
                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Link href={Links.orderProductId(item.productId)} className="flex items-center gap-2 link:text-main-bg link:underline">
                                        {item.title}
                                        <ExternalLinkIcon size={18} />
                                    </Link>
                                </TableCell>
                                <TableCell>{quantity}</TableCell>
                                <TableCell>{i18n.format.money(intPrice)}</TableCell>
                                <TableCell>{i18n.format.money(quantity * intPrice)}</TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell colSpan={4}>
                            {state.users.length > 0 ? (
                                <Link href={Links.orderProduct} className="flex flex-row items-center gap-2">
                                    <PlusIcon size={18} />
                                    Novo Produto
                                </Link>
                            ) : (
                                <span>Você precisa adicionar seus amigos antes</span>
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );
};

const ComandaPage: NextPageWithLayout = () => {
    const [state, dispatch] = Orders.use();
    const router = useRouter();

    const onSubmit = async () => {
        const result = await Orders.onSubmit(state);
        const saved = History.save(result);
        Orders.clear();
        dispatch.reset();
        await router.push(Links.orderId(saved.id));
    };

    return (
        <main className="flex flex-col gap-8">
            <Form className="hidden h-0" id="form" name="form" onSubmit={onSubmit} onReset={dispatch.reset} />
            <InitialData />
            <MyFriends />
            <AdditionalCharges />
            <MyProducts />
            <footer className="flex flex-col gap-4">
                <Button type="submit" form="form">
                    Fecha a conta
                </Button>
                <Button type="reset" form="form" theme="transparent-danger">
                    Apagar tudo
                </Button>
            </footer>
        </main>
    );
};

ComandaPage.getLayout = AdminLayout;

export default ComandaPage;
