import { toBlob } from "html-to-image";
import { CheckCheckIcon, HandshakeIcon, ShareIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Is } from "sidekicker";
import { toast } from "sonner";
import { AppDescription, Card, Logo, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Title } from "~/components/";
import AdminLayout from "~/components/admin/layout";
import { useTranslations } from "~/i18n";
import { CanIUse } from "~/lib/can";
import { PaymentStatus } from "~/models/payments";
import { Product } from "~/models/product";
import { Orders } from "~/services/orders/orders.types";
import { Friends } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { Platform } from "~/store/platform";
import { Preferences } from "~/store/preferences.store";
import { NextPageWithLayout, Nullable } from "~/types";

const CartId: NextPageWithLayout = () => {
    const [friends] = Friends.use();
    const [preferences] = Preferences.use();
    const router = useRouter();
    const paths = router.query;
    const i18n = useTranslations();
    const ref = useRef<HTMLDivElement>(null);
    const [order, setOrder] = useState<Nullable<Orders.Shape>>(null);
    const ID = paths.id as string;

    const setOrderFromId = useCallback((id: string) => setOrder(History.get(id, friends.users.toArray().concat(preferences.user))), [paths, friends.users]);

    useEffect(() => {
        setOrderFromId(ID);
    }, [setOrderFromId, ID]);

    const sortedUsers = useMemo(() => (Is.nil(order) ? [] : order?.users.toSorted((a, b) => a.data.name.toLowerCase().localeCompare(b.data.name.toLowerCase()))), [order]);

    if (Is.nil(order)) return <Fragment />;

    const onShareElement = async (div: HTMLElement) => {
        div.setAttribute("data-image", "true");
        const blob = await toBlob(div, { quality: 100, height: div.clientHeight });
        div.removeAttribute("data-image");
        const file = new File([blob!], `${order.title}.png`, {
            lastModified: Date.now(),
            type: blob!.type || "image/png"
        });
        if (Platform.isMobile() && CanIUse.webShareAPI()) {
            const files = [file];
            if (navigator.canShare({ files })) {
                const reset = (e?: any) => {
                    if (e) console.error(e);
                    return e;
                };
                const result = await navigator.share({ files }).catch(reset).then(reset);
                if (result === undefined) return;
            }
        }
        if (CanIUse.clipboard()) {
            const items = [new ClipboardItem({ "image/png": file })];
            await navigator.clipboard.write(items);
            return void toast.info("Imagem copiada para o seu CTRL + V");
        }
    };

    const onPersonShare = (e: React.MouseEvent<HTMLButtonElement>) => {
        const element = document.getElementById(e.currentTarget.dataset.id ?? "");
        if (element) return onShareElement(element);
    };

    const nTotal = Number(order.total);

    const total = i18n.format.money(nTotal);

    const couvert = order.metadata.couvert * order.metadata.consumers;

    const tip = (order.metadata.additional - 1) * order.metadata.base;

    return (
        <main ref={ref} className="group space-y-6 bg-body-bg text-body">
            <Card className="flex flex-col gap-2">
                <Title>{order.title}</Title>
                <p>Data do evento: {i18n.format.datetime(order.createdAt)}</p>
                <div className="flex flex-col justify-between gap-2">
                    <p>
                        Total: <b className="text-main-bg">{total}</b>
                    </p>
                    <p>Pessoas na conta: {sortedUsers.length}</p>
                    {/*<Link*/}
                    {/*  href={Links.cart}*/}
                    {/*  onClick={() => dispatch.set(History.parseToCart(order))}*/}
                    {/*  className="underline underline-offset-4 group-data-[image=true]:hidden"*/}
                    {/*>*/}
                    {/*  Editar comanda*/}
                    {/*</Link>*/}
                </div>
            </Card>
            <Card>
                <ul className="mt-6 space-y-8">
                    {sortedUsers.map((user) => {
                        const setPaymentForUser = () => {
                            const newOrder = History.setPaymentStatus(order.id, user.payment?.id!, PaymentStatus.Paid);
                            if (newOrder) setOrderFromId(newOrder.id);
                        };
                        return (
                            <li id={user.id} key={user.id} className="group flex flex-wrap justify-between space-y-6 data-[image=true]:bg-card-bg data-[image=true]:p-4">
                                <div hidden className="hidden space-y-2 group-data-[image=true]:mb-4 group-data-[image=true]:block">
                                    <Logo type="raw" />
                                    <AppDescription />
                                </div>
                                <header className="flex w-full items-center justify-between">
                                    {user.data.name}
                                    <span>{i18n.format.money(Number(user.payment?.amount!))}</span>
                                </header>
                                <section className="flex w-full flex-row items-center justify-between">
                                    <p className="text-sm">
                                        {user.payment?.status === PaymentStatus.Paid ? (
                                            <span className="flex items-center gap-2 text-success">
                                                <CheckCheckIcon />
                                                Pago
                                            </span>
                                        ) : (
                                            <button className="flex items-center gap-2 text-main-soft" onClick={setPaymentForUser}>
                                                <HandshakeIcon size={16} />
                                                Marcar como pago
                                            </button>
                                        )}
                                    </p>
                                    <button
                                        className="flex items-center gap-2 text-sm font-medium group-data-[image=true]:hidden"
                                        data-id={user.id}
                                        onClick={onPersonShare}
                                        title={`Compartilhar comanda de ${user.data.name}`}
                                    >
                                        <ShareIcon absoluteStrokeWidth size={16} strokeWidth={2} />
                                        Compartilhar
                                    </button>
                                </section>
                                {user.orderItem.length === 0 ? null : (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableHeader>Produto</TableHeader>
                                                <TableHeader>Total</TableHeader>
                                                <TableHeader>Quantidade</TableHeader>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {user.orderItem.map((product) => (
                                                <TableRow key={`${user.id}-${product.id}`}>
                                                    <TableCell>
                                                        {product.title === Orders.OrderItem.Additional
                                                            ? "Gorjeta"
                                                            : product.title === Orders.OrderItem.Couvert
                                                              ? "Couvert"
                                                              : product.title}
                                                    </TableCell>
                                                    <TableCell>{i18n.format.money(Number(product.total))}</TableCell>
                                                    <TableCell>
                                                        {Product.isTipOrCouvert(product)
                                                            ? product.quantity
                                                            : Product.formatQuantity(product.quantity, order.metadata.products[product.productId])}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </li>
                        );
                    })}
                    <li className="flex justify-between pt-2">
                        <span>Consumo</span>
                        <b>{i18n.format.money(order.metadata.base)}</b>
                    </li>
                    {tip > 0 ? (
                        <li className="flex justify-between">
                            <span>Gorjeta</span>
                            <b>{i18n.format.money(tip)}</b>
                        </li>
                    ) : null}
                    {order.metadata.couvert > 0 ? (
                        <li className="flex justify-between">
                            <span>Couvert total</span>
                            <b>{i18n.format.money(couvert)}</b>
                        </li>
                    ) : null}
                    <li className="flex justify-between">
                        <span>Total</span>
                        <b>{total}</b>
                    </li>
                </ul>
            </Card>
        </main>
    );
};

CartId.getLayout = AdminLayout;

export default CartId;
