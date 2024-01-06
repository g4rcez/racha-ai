import { Dict } from "~/lib/dict";
import {fixed, fromStrNumber, sum} from "~/lib/fn";
import {CartProduct, CartState} from "~/store/cart.store";
import { User } from "~/store/friends.store";

export namespace CartMath {
  type Couvert = { total: number; each: number };

  const size = (a: Dict<any, any> | any[]) => (Array.isArray(a) ? a.length : a.size);

  const calcCouvert = (cart: CartState): Couvert => {
    if (!cart.hasCouvert) return { total: 0, each: 0 };
    const each = fromStrNumber(cart.couvert);
    return { each, total: each * size(cart.users) };
  };

  const calcAdditional = (cart: CartState): number =>
    !cart.hasAdditional ? 1 : fromStrNumber(cart.additional) / 100 + 1;

  const sumProducts = (products: CartState["products"]): number =>
    products.map((x) => x.quantity * x.price).reduce(sum, 0);

  export const perUser = (products: CartProduct[], user: User, additional: number, couvert: Couvert) => {
    const amount = products.flatMap((p) => p.consumers.map((c) => (c.id === user.id ? c.amount : 0)));
    const productsTotal = amount.reduce(sum, 0);
    const bonus = fixed(additional - 1);
    const total = fixed(productsTotal * bonus);
    return {
      total,
      additional: fixed(additional),
      totalWithCouvert: amount.reduce(sum, 0) * additional + couvert.each
    };
  };

  export const calculate = (cart: CartState) => {
    const additional = calcAdditional(cart);
    const couvert = calcCouvert(cart);
    const products = sumProducts(cart.products);
    const total = products * additional + couvert.total;
    return { additional, couvert, products, total };
  };
}
