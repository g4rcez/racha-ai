import { Dict } from "~/lib/dict";
import { fixed, fromStrNumber, sum } from "~/lib/fn";
import { CartProduct } from "~/store/cart.store";
import { User } from "~/store/friends.store";
import { ParseToRaw } from "~/types";

export namespace CartMath {
  type Couvert = { total: number; each: number };

  const size = (a: Dict<any, any> | any[]) =>
    Array.isArray(a) ? a.length : a.size;

  const calcCouvert = (
    hasCouvert: boolean,
    couvert: string,
    users: any,
  ): Couvert => {
    if (!hasCouvert) return { total: 0, each: 0 };
    const each = fromStrNumber(couvert);
    return { each, total: each * size(users) };
  };

  const calcAdditional = (
    hasAdditional: boolean,
    additional: string,
  ): number => (!hasAdditional ? 1 : fromStrNumber(additional) / 100 + 1);

  const sumProducts = (
    products: Array<{ price: number; quantity: number }>,
  ): number => products.map((x) => x.quantity * x.price).reduce(sum, 0);

  export const perUser = (
    products: CartProduct[],
    user: User,
    additional: number,
    couvert: Couvert,
  ) => {
    const amount = products.flatMap((p) =>
      p.consumers.arrayMap((c) => (c.id === user.id ? c.amount : 0)),
    );
    const productsTotal = amount.reduce(sum, 0);
    const bonus = fixed(additional - 1);
    const total = fixed(productsTotal * bonus);
    return {
      total,
      additional: fixed(additional),
      totalWithCouvert: amount.reduce(sum, 0) * additional + couvert.each,
    };
  };

  type Props = {
    additional: string;
    couvert: string;
    hasAdditional: boolean;
    hasCouvert: boolean;
    products: ParseToRaw<CartProduct[]>;
    users: any;
  };

  export const calculate = <T extends Props>(cart: T) => {
    const couvert = calcCouvert(cart.hasCouvert, cart.couvert, cart.users);
    const products = sumProducts(cart.products);
    const additional = calcAdditional(cart.hasAdditional, cart.additional);
    const total = products * additional + couvert.total;
    return {
      total,
      couvert,
      products,
      additional,
      totalAdditional: products * (additional - 1),
    };
  };

  export const sumWithAdditional = (
    calc: ReturnType<typeof calculate>,
    total: number,
  ) => calc.additional * total;
}
