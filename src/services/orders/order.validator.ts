import { z } from "zod";
import { i18n } from "~/i18n";
import { Division } from "~/models/entity-types";
import { Product } from "~/models/product";
import { Store } from "~/models/store";
import { Friends } from "~/store/friends.store";

export namespace OrdersValidator {
  export const product = Product.schema.extend({
    division: z.nativeEnum(Division).optional().default(Division.Equals),
    consumers: z.array(
      Friends.schema.extend({ amount: z.number(), quantity: z.number() }),
    ),
  });

  const user = Friends.schema.or(z.object({ id: z.string().uuid() }));

  export const cartSchema = z.object({
    id: z.string().uuid(),
    currentProduct: product.nullable().default(null),
    createdAt: Store.date,
    finishedAt: Store.date,
    type: z.string(),
    title: z.string().default(""),
    couvert: z.coerce.string().default(""),
    category: z.string().default(""),
    justMe: z.boolean().default(false),
    additional: z.coerce.string().default(""),
    products: z.array(product).default([]),
    hasCouvert: z.boolean().default(false),
    hasAdditional: z.boolean().default(true),
    groupId: z.string().uuid().nullable().default(null),
    me: user.nullable().default(null),
    metadata: z
      .object({ location: z.any(), description: z.string() })
      .partial()
      .default({}),
    users: z.array(user).default([]),
    currencyCode: z.string().default(i18n.getCurrency() as string),
  });

  export type Cart = z.infer<typeof cartSchema>;

  export enum CartStatus {
    paid = "paid",
    pending = "pending",
  }
}
