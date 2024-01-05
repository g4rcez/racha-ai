import { jsonResponse, Link, LoaderProps, useDataLoader } from "brouther";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { SectionTitle } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { Is } from "~/lib/is";
import { links } from "~/router";
import { Cart } from "~/store/cart.store";
import { History, HistoryItem } from "~/store/history.store";
import { Preferences } from "~/store/preferences.store";
import { ParseToRaw } from "~/types";

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
  const history = data?.cart
    ? History.parse(data.cart as unknown as ParseToRaw<HistoryItem>)
    : null;
  if (Is.nil(history)) {
    return <main>Not found</main>;
  }
  const total = i18n.format.money(history.total);
  return (
    <main>
      <section className="flex flex-col">
        <SectionTitle paragraphClassName="text-lg" title={history.title}>
          Total: <b className="text-main-bg">{total}</b>
        </SectionTitle>
        {history.createdAt ? (
          <p>
            Data do evento: {i18n.format.datetime(new Date(history.createdAt))}
          </p>
        ) : null}
        <Link
          href={links.cart}
          onClick={() => dispatch.set(History.parseToCart(history))}
        >
          Editar
        </Link>
      </section>
      <ul className="mt-6 space-y-4">
        {history.users.map((user) => {
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
                          <TableCell>{product.quantity}</TableCell>
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
            <b>{i18n.format.money(history.additional)}</b>
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
