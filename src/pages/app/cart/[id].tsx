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
import { Cart } from "~/store/cart.store";
import { History, HistoryItem } from "~/store/history.store";
import { Platform } from "~/store/platform";
import { NextPageWithLayout, Nullable } from "~/types";

const CartId: NextPageWithLayout = () => {
  const router = useRouter();
  const paths = router.query;
  const i18n = useTranslations();
  const [_, dispatch] = Cart.use();
  const ref = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<Nullable<HistoryItem>>(null);

  useEffect(() => {
    const x = History.get(paths.id as string);
    if (x) setHistory(x);
  }, [paths]);

  if (Is.nil(history)) {
    return <Fragment />;
  }

  const total = i18n.format.money(history.total);

  const onShareElement = async (div: HTMLElement) => {
    div.setAttribute("data-image", "true");
    const blob = await toBlob(div, { quality: 100, height: div.clientHeight });
    div.removeAttribute("data-image");
    const file = new File([blob!], `${history.title}.png`, {
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
    if (element) onShareElement(element);
  };

  return (
    <main
      ref={ref}
      className="group space-y-6 shareable data-[image=true]:p-2 text-body bg-body-bg"
    >
      <Card className="flex gap-2 flex-col">
        <Title>{history.title}</Title>
        <p>Data do evento: {i18n.format.datetime(history.createdAt)}</p>
        <div className="flex justify-between items-center">
          <p>
            Total: <b className="text-main-bg">{total}</b>
          </p>
          <Link
            href={Links.cart}
            onClick={() => dispatch.set(History.parseToCart(history))}
            className="underline underline-offset-4 group-data-[image=true]:hidden"
          >
            Editar comanda
          </Link>
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
          {history.users.arrayMap((user) => (
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
                  {user.name}
                </button>
                <span>{i18n.format.money(user.result.totalWithCouvert)}</span>
              </header>
              {user.products.length === 0 ? null : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Produto</TableHeader>
                      <TableHeader>Total</TableHeader>
                      <TableHeader>Quantidade</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.products.map((product) =>
                      product.quantity === 0 ? null : (
                        <TableRow key={`${user.id}-${product.id}`}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            {i18n.format.money(product.total)}
                          </TableCell>
                          <TableCell>{toFraction(product.quantity)}</TableCell>
                        </TableRow>
                      ),
                    )}
                    {history.hasAdditional ? (
                      <TableRow>
                        <TableCell>Gorjeta</TableCell>
                        <TableCell>
                          {i18n.format.money(user.result.total)}
                        </TableCell>
                        <TableCell>1</TableCell>
                      </TableRow>
                    ) : null}
                    {history.hasCouvert ? (
                      <TableRow>
                        <TableCell>Couvert</TableCell>
                        <TableCell>
                          {i18n.format.money(history.couvert)}
                        </TableCell>
                        <TableCell>1</TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              )}
            </li>
          ))}
          <li className="flex justify-between pt-2">
            <span>Consumo</span>
            <b>{i18n.format.money(history.totalProducts)}</b>
          </li>
          {history.hasAdditional ? (
            <li className="flex justify-between">
              <span>Gorjeta</span>
              <b>{i18n.format.money(history.withAdditional)}</b>
            </li>
          ) : null}
          {history.hasCouvert ? (
            <li className="flex justify-between">
              <span>Couvert total</span>
              <b>{i18n.format.money(history.couvert * history.users.size)}</b>
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
