import { toBlob } from "html-to-image";
import { ShareIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "~/components/admin/layout";
import { Button } from "~/components/button";
import { Card } from "~/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { CanIUse } from "~/lib/can";
import { toFraction } from "~/lib/fn";
import { Is } from "~/lib/is";
import { Links } from "~/router";
import { Orders } from "~/services/orders/orders.types";
import { Cart } from "~/store/cart.store";
import { Friends } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { Platform } from "~/store/platform";
import { NextPageWithLayout, Nullable } from "~/types";

const CartId: NextPageWithLayout = () => {
  const router = useRouter();
  const paths = router.query;
  const i18n = useTranslations();
  const [_, dispatch] = Cart.use();
  const ref = useRef<HTMLDivElement>(null);
  const [friends] = Friends.use();
  const [order, setOrder] = useState<Nullable<Orders.Shape>>(null);

  useEffect(
    () => setOrder(History.get(paths.id as string, friends.users.toArray())),
    [paths, friends.users],
  );

  console.log(order);

  if (Is.nil(order)) {
    return <Fragment />;
  }

  const onShareElement = async (div: HTMLElement) => {
    div.setAttribute("data-image", "true");
    const blob = await toBlob(div, { quality: 100, height: div.clientHeight });
    div.removeAttribute("data-image");
    const file = new File([blob!], `${order.title}.png`, {
      lastModified: Date.now(),
      type: blob!.type || "image/png",
    });
    if (Platform.isMobile() && CanIUse.webShareAPI()) {
      const files = [file];
      if (navigator.canShare({ files })) {
        const reset = (e?: any) => {
          if (e) console.error(e);
          return e;
        };
        const result = await navigator
          .share({ files })
          .catch(reset)
          .then(reset);
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

  const consume = nTotal - order.metadata.additional - (couvert || 0);

  const sortedUsers = order.users.toSorted((a, b) =>
    a.payment?.amount && b.payment?.amount
      ? Number(b.payment.amount) - Number(a.payment.amount)
      : 1,
  );

  return (
    <main
      ref={ref}
      className="group space-y-6 shareable data-[image=true]:p-2 text-body bg-body-bg"
    >
      <Card className="flex gap-2 flex-col">
        <Title>{order.title}</Title>
        <p>Data do evento: {i18n.format.datetime(order.createdAt)}</p>
        <div className="flex justify-between items-center">
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
        <Button
          onClick={onShare}
          className="w-full my-4 print:hidden group-data-[image=true]:hidden"
          icon={<ShareIcon absoluteStrokeWidth size={18} strokeWidth={2} />}
        >
          Compartilhar comanda
        </Button>
      </Card>
      <Card>
        <ul className="mt-6 space-y-8">
          {sortedUsers.map((user) => (
            <li
              id={user.id}
              key={user.id}
              className="group space-y-6 shareable data-[image=true]:bg-card-bg flex flex-wrap justify-between"
            >
              <header className="w-full flex items-center justify-between">
                <button
                  data-id={user.id}
                  onClick={onPersonShare}
                  className="text-lg font-medium items-center flex gap-2"
                >
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
                        <TableCell>
                          {i18n.format.money(Number(product.total))}
                        </TableCell>
                        <TableCell>
                          {toFraction(Number(product.quantity))}
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
          {consume !== nTotal ? (
            <li className="flex justify-between">
              <span>Gorjeta</span>
              <b>
                {i18n.format.money(
                  (order.metadata.additional - 1) * order.metadata.base,
                )}
              </b>
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
