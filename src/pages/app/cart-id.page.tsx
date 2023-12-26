import { jsonResponse, LoaderProps, useDataLoader } from "brouther";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/table";
import { SectionTitle } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { CartMath } from "~/lib/cart-math";
import { Dict } from "~/lib/dict";
import { Is } from "~/lib/is";
import { CartState } from "~/store/cart.store";
import { History } from "~/store/history.store";
import { ParseToRaw } from "~/types";

type L = "/app/cart/:id";

type SimpleProduct = {
    total: string;
    name: string;
    id: string;
    price: string;
    quantity: number;
};

export const loader = (context: LoaderProps<L>) => {
    const id = context.paths.id;
    const cart: ParseToRaw<CartState> = History.get(id) as any;
    return jsonResponse({ cart });
};

export default function CartId() {
    const data = useDataLoader<typeof loader>();
    const cart = data?.cart ? History.parse(data.cart) : null;
    const i18n = useTranslations();
    if (Is.nil(cart)) {
        return <main>Not found</main>;
    }
    const { additional, couvert, products: productsPrice, total } = CartMath.calculate(cart, i18n.format.money);
    const products = cart.products.toArray();
    return (
        <main className="pb-6">
            <SectionTitle paragraphClassName="text-lg" title={cart.title}>
                Total: <b className="text-main-bg">{total}</b>
            </SectionTitle>
            {cart.createdAt ? <p>Data do evento: {i18n.format.datetime(new Date(cart.createdAt))}</p> : null}
            <ul className="mt-6 space-y-4">
                {cart.users.map((user) => {
                    const result = CartMath.perUser(products, user, additional, couvert);
                    const ownProducts = products.reduce<SimpleProduct[]>((acc, p) => {
                        const consumed = Dict.toArray(p.consumers).find((x) => x.id === user.id);
                        return consumed === undefined
                            ? acc
                            : [
                                  ...acc,
                                  {
                                      name: p.name,
                                      id: p.id,
                                      price: p.monetary,
                                      quantity: consumed.quantity,
                                      total: i18n.format.money(consumed.quantity * p.price),
                                  },
                              ];
                    }, []);
                    return (
                        <li className="flex flex-wrap justify-between" key={user.id}>
                            <span className="font-medium text-lg">{user.name}</span>
                            <span>{i18n.format.money(result)}</span>
                            {ownProducts.length === 0 ? null : (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeader>Produto</TableHeader>
                                            <TableHeader>Total</TableHeader>
                                            <TableHeader>Quantidade</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ownProducts.map((product) =>
                                            product.quantity === 0 ? null : (
                                                <TableRow key={`${user.id}-${product.id}`}>
                                                    <TableCell>{product.name}</TableCell>
                                                    <TableCell>{product.total}</TableCell>
                                                    <TableCell>{product.quantity}</TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                        {cart.hasAdditional ? (
                                            <TableRow>
                                                <TableCell>Gorjeta</TableCell>
                                                <TableCell>{i18n.format.money(result * (additional - 1))}</TableCell>
                                                <TableCell>1</TableCell>
                                            </TableRow>
                                        ) : null}
                                        {cart.hasCouvert ? (
                                            <TableRow>
                                                <TableCell>Couvert</TableCell>
                                                <TableCell>{i18n.format.money(couvert.each)}</TableCell>
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
                    <b>{i18n.format.money(productsPrice)}</b>
                </li>
                {cart.hasAdditional ? (
                    <li className="flex justify-between">
                        <span>Gorjeta</span>
                        <b>{i18n.format.money(productsPrice * (additional - 1))}</b>
                    </li>
                ) : null}
                {cart.hasCouvert ? (
                    <li className="flex justify-between">
                        <span>Couvert/pessoa</span>
                        <b>{i18n.format.money(couvert.total)}</b>
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
