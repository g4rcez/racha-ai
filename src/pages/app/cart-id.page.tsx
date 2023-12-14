import { jsonResponse, LoaderProps, useDataLoader } from "brouther";
import { SectionTitle } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { fromStrNumber, sum } from "~/lib/fn";
import { Is } from "~/lib/is";
import { CartState } from "~/store/cart.store";
import { User } from "~/store/friends.store";
import { History } from "~/store/history.store";
import { ParseToRaw } from "~/types";

type L = "/app/cart/:id";
type Cart = ParseToRaw<CartState>;
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

type Couvert = { total: number; each: number };
const calcCouvert = (cart: Cart): Couvert => {
    if (!cart.hasCouvert) return { total: 0, each: 0 };
    const each = fromStrNumber(cart.couvert);
    return { each, total: each * cart.users.length };
};

const calcAdditional = (cart: Cart): number => (!cart.hasAdditional ? 1 : fromStrNumber(cart.additional) / 100 + 1);

const sumProducts = (cart: Cart): number => cart.products.map((x) => x.quantity * x.price).reduce(sum, 0);

const calcPerUser = (cart: Cart, user: ParseToRaw<User>, additional: number, couvert: Couvert) =>
    cart.products.flatMap((p) => p.consumers.map((c) => (c.id === user.id ? c.amount : 0))).reduce(sum, 0) *
        additional +
    couvert.each;

export default function CartId() {
    const data = useDataLoader<typeof loader>();
    const cart: Cart = (data?.cart as any) ?? null;
    const i18n = useTranslations();
    if (Is.nil(cart)) {
        return <main>Not found</main>;
    }
    const additional = calcAdditional(cart);
    const couvert = calcCouvert(cart);
    const products = sumProducts(cart);
    const total = i18n.format.money(products * additional + couvert.total);
    return (
        <main className="pb-6">
            <SectionTitle paragraphClassName="text-lg" title={cart.title}>
                Total: <b className="text-main-bg">{total}</b>
            </SectionTitle>
            {cart.createdAt ? <p>Data do evento: {i18n.format.datetime(new Date(cart.createdAt))}</p> : null}
            <ul className="mt-6 space-y-4">
                {cart.users.map((user) => {
                    const result = calcPerUser(cart, user, additional, couvert);
                    const ownProducts = cart.products.reduce<SimpleProduct[]>((acc, p) => {
                        const consumed = p.consumers.find((x) => x.id === user.id);
                        return consumed === undefined
                            ? acc
                            : [
                                  ...acc,
                                  {
                                      name: p.name,
                                      id: p.id,
                                      price: p.monetary,
                                      quantity: consumed.quantity,
                                      total: i18n.format.money(consumed.quantity * p.price)
                                  }
                              ];
                    }, []);
                    return (
                        <li className="flex flex-wrap justify-between" key={user.id}>
                            <span>{user.name}</span>
                            <span>{i18n.format.money(result)}</span>
                            {ownProducts.length === 0 ? null : (
                                <ul className="w-full min-w-full space-y-2 text-sm">
                                    <li className="mt-2 grid grid-cols-3">
                                        <span>Produto</span>
                                        <span className="text-center">Total</span>
                                        <span className="text-right">Quantidade</span>
                                    </li>
                                    {ownProducts.map((product) =>
                                        product.quantity === 0 ? null : (
                                            <li key={`${product.id}-${user.id}`} className="grid grid-cols-3">
                                                <span className="overflow-hidden truncate">{product.name}</span>
                                                <span className="text-center">{product.total}</span>
                                                <span className="text-right">{product.quantity}</span>
                                            </li>
                                        )
                                    )}
                                    {cart.hasAdditional ? (
                                        <li className="grid grid-cols-3">
                                            <span className="overflow-hidden truncate">Gorjeta</span>
                                            <span className="text-center">
                                                {i18n.format.money(result * (additional - 1))}
                                            </span>
                                            <span className="text-right">1</span>
                                        </li>
                                    ) : null}
                                    {cart.hasCouvert ? (
                                        <li className="grid grid-cols-3">
                                            <span className="overflow-hidden truncate">Couvert</span>
                                            <span className="text-center">{i18n.format.money(couvert.each)}</span>
                                            <span className="text-right">1</span>
                                        </li>
                                    ) : null}
                                </ul>
                            )}
                        </li>
                    );
                })}
                <li className="flex justify-between border-t border-muted-input/50 pt-2 font-bold">
                    <span>Consumo</span>
                    {i18n.format.money(products)}
                </li>
                {cart.hasAdditional ? (
                    <li className="flex justify-between border-t border-muted-input/50 pt-2 font-bold">
                        <span>Gorjeta</span>
                        {i18n.format.money(products * (additional - 1))}
                    </li>
                ) : null}
                {cart.hasCouvert ? (
                    <li className="flex justify-between border-t border-muted-input/50 pt-2 font-bold">
                        <span>Couvert/pessoa</span>
                        {i18n.format.money(couvert.total)}
                    </li>
                ) : null}
                <li className="flex justify-between border-t border-muted-input pt-2 font-bold">
                    <span>Total</span>
                    {total}
                </li>
            </ul>
        </main>
    );
}
