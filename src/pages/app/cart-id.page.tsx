import { jsonResponse, Link, LoaderProps, useDataLoader } from "brouther";
import { ShareIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/button";
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
import { sleep, toFraction } from "~/lib/fn";
import { Is } from "~/lib/is";
import { links } from "~/router";
import { Cart } from "~/store/cart.store";
import { History, HistoryItem } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";
import { ParseToRaw } from "~/types";
import { toBlob } from "html-to-image";

type L = "/app/cart/:id";

export const loader = (context: LoaderProps<L>) => {
  const id = context.paths.id;
  const cart = History.get(id);
  return jsonResponse({ cart });
};

export default function CartId() {
  const [_me] = Preferences.use((state) => state.user);
  const [_, dispatch] = Cart.use();
  const data = useDataLoader<typeof loader>();
  const i18n = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  const [imgMode, setImgMode] = useState(false);

  const history = data?.cart
    ? History.parse(data.cart as unknown as ParseToRaw<HistoryItem>)
    : null;

  if (Is.nil(history)) {
    return <main>Not found</main>;
  }

  const total = i18n.format.money(history.total);

  const onShare = async () => {
    setImgMode(true);
    sleep(1000);
    const blob = await toBlob(ref.current!);
    const files = [
      new File([blob!], `${history.title}.png`, {
        type: blob!.type || "image/png",
      }),
    ];
    const reset = () => setImgMode(false);
    navigator
      .share({
        files,
        title: history.title,
        text: `${
          history.title
        } - ${history.createdAt.toLocaleDateString()} ${history.createdAt.toLocaleTimeString()}`,
      })
      .catch(reset)
      .then(reset);
  };

  return (
    <main ref={ref} data-image={imgMode} className="data-[image=true]:p-4">
      <section className="flex gap-2 flex-col">
        <Title>{history.title}</Title>
        <p>Data do evento: {i18n.format.datetime(history.createdAt)}</p>
        <div className="flex justify-between items-center">
          <p>
            Total: <b className="text-main-bg">{total}</b>
          </p>
          <Link
            href={links.cart}
            data-image={imgMode}
            onClick={() => dispatch.set(History.parseToCart(history))}
            className="underline underline-offset-4 data-[image=true]:hidden"
          >
            Editar comanda
          </Link>
        </div>
      </section>
      <Button
        onClick={onShare}
        data-image={imgMode}
        className="w-full my-4 print:hidden data-[image=true]:hidden"
        icon={<ShareIcon absoluteStrokeWidth size={18} strokeWidth={2} />}
      >
        Compartilhar comanda
      </Button>
      <ul className="mt-6 space-y-4">
        {history.users.arrayMap((user) => {
          return (
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
          );
        })}
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
    </main>
  );
}
