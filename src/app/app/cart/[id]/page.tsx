"use client";
import { toBlob } from "html-to-image";
import { ShareIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
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
import { Cart } from "~/store/cart.store";
import { History } from "~/store/history.store";

export default function CartId() {
  const paths = useParams();
  const i18n = useTranslations();
  const [_, dispatch] = Cart.use();
  const ref = useRef<HTMLDivElement>(null);

  const history = History.get(paths.id as string);
  if (Is.nil(history)) {
    return <main>Not found</main>;
  }

  const total = i18n.format.money(history.total);

  const onShare = async () => {
    const div = ref.current;
    if (div === null) return;
    div.setAttribute("data-image", "true");
    const blob = await toBlob(div, { quality: 100, height: div.clientHeight });
    div.removeAttribute("data-image");
    const file = new File([blob!], `${history.title}.png`, {
      lastModified: Date.now(),
      type: blob!.type || "image/png",
    });
    if (CanIUse.webShareAPI()) {
      const files = [file];
      if (navigator.canShare({ files })) {
        const reset = (e?: any) => (e ? console.error(e) : undefined);
        return void navigator.share({ files }).catch(reset).then(reset);
      }
    }
    if (CanIUse.clipboard()) {
      const items = [new ClipboardItem({ "image/png": file })];
      await navigator.clipboard.write(items);
      return void toast.info("Imagem copiada para o seu CTRL + V");
    }
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
            href="/app/cart"
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
        <ul className="mt-6 space-y-4">
          {history.users.arrayMap((user) => (
            <li className="flex flex-wrap justify-between" key={user.id}>
              <span className="text-lg font-medium">{user.name}</span>
              <span>{i18n.format.money(user.result.totalWithCouvert)}</span>
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
              <span>Couvert/pessoa</span>
              <b>{i18n.format.money(history.couvert)}</b>
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
}
