import { toBlob } from "html-to-image";
import { ShareIcon } from "lucide-react";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/core/button";
import { Card } from "~/components/core/card";
import { Title } from "~/components/core/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/table";
import { useTranslations } from "~/i18n";
import { CanIUse } from "~/lib/can";
import { Is } from "~/lib/is";
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

    useEffect(() => setOrder(History.get(paths.id as string, friends.users.toArray().concat(preferences.user))), [paths, friends.users]);

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

    const onShare = () => (ref.current ? onShareElement(ref.current) : undefined);

    const onPersonShare = (e: React.MouseEvent<HTMLButtonElement>) => {
        const element = document.getElementById(e.currentTarget.dataset.id ?? "");
        if (element) return onShareElement(element);
    };

    const nTotal = Number(order.total);

    const total = i18n.format.money(nTotal);

    const couvert = order.metadata.couvert * order.metadata.consumers;

    const tip = (order.metadata.additional - 1) * order.metadata.base;

    return (
        <main ref={ref} className="shareable group space-y-6 bg-body-bg text-body data-[image=true]:p-2">
            <Card className="flex flex-col gap-2">
                <Title>{order.title}</Title>
                <p>Data do evento: {i18n.format.datetime(order.createdAt)}</p>
                <div className="flex items-center justify-between">
                    <p>
                        Total: <b className="text-main-bg">{total}</b>
                    </p>
                    {/*<Link*/}
                    {/*  href={Links.cart}*/}
                    {/*  onClick={() => dispatch.set(History.parseToCart(order))}*/}
                    {/*  className="underline underline-offset-4 group-data-[image=true]:hidden"*/}
                    {/*>*/}
                    {/*  Editar comanda*/}
                    {/*</Link>*/}
                </div>
                <Button onClick={onShare} className="my-4 w-full group-data-[image=true]:hidden print:hidden" icon={<ShareIcon absoluteStrokeWidth size={18} strokeWidth={2} />}>
                    Compartilhar comanda
                </Button>
            </Card>
            <Card>
                <ul className="mt-6 space-y-8">
                    {sortedUsers.map((user) => (
                        <li
                            id={user.id}
                            key={user.id}
                            className="shareable group flex flex-wrap justify-between space-y-6 data-[image=true]:space-y-0 data-[image=true]:bg-card-bg"
                        >
                            <header className="flex w-full items-center justify-between">
                                <button data-id={user.id} onClick={onPersonShare} className="flex items-center gap-2 text-lg font-medium">
                                    <ShareIcon absoluteStrokeWidth size={16} strokeWidth={2} />
                                    {user.data.name}
                                </button>
                                <span>{i18n.format.money(Number(user.payment?.amount!))}</span>
                            </header>
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
                    ))}
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
