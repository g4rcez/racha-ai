import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import type { DB } from "~/db/types";
import { Store } from "~/models/store";
import { Orders } from "~/services/orders/orders.types";

export type Product = Store.New<{
  name: string;
  price: number;
  monetary: string;
  quantity: number;
}>;

export namespace Product {
  export const schema = z.object({
    ...Store.schema.shape,
    name: z.string(),
    price: z.number(),
    monetary: z.string(),
    id: z.string().uuid(),
    quantity: z.number().int(),
  });

  export const create = (): Product => ({
    createdAt: new Date(),
    id: uuidv7(),
    name: "",
    price: 0,
    monetary: "",
    quantity: 0,
  });

  export const tipId = "11111111-1111-1111-1111-111111111111";

  export const couvertId = "22222222-2222-2222-2222-222222222222";

  export type Shape = {
    category: string;
    createdAt: Date;
    id: string;
    orderId: string;
    ownerId: string;
    price: number;
    productId: string;
    quantity: number;
    splitType: string;
    title: string;
    total: number;
    type: string;
  };

  type Base = Omit<DB.OrderItem, "createdAt" | "id">;

  export const New = (props: Base): DB.OrderItem => ({
    id: uuidv7(),
    category: props.category || "",
    createdAt: new Date(),
    orderId: props.orderId,
    ownerId: props.ownerId,
    price: props.price,
    productId: props.productId,
    quantity: props.quantity,
    splitType: props.splitType,
    title: props.title,
    total: props.total,
    type: props.type || "",
  });

  export const tip = (
    props: Omit<
      DB.OrderItem,
      "createdAt" | "id" | "quantity" | "productId" | "title" | "price"
    >,
  ) => {
    const newProps = props as any as Base;
    newProps.productId = tipId;
    newProps.quantity = "1";
    newProps.price = props.total;
    newProps.title = Orders.OrderItem.Additional;
    return New(newProps);
  };

  export const couvert = (
    props: Omit<
      DB.OrderItem,
      "createdAt" | "id" | "quantity" | "productId" | "title" | "price"
    >,
  ) => {
    const newProps = props as any as Base;
    newProps.productId = couvertId;
    newProps.quantity = "1";
    newProps.price = props.total;
    newProps.title = Orders.OrderItem.Couvert;
    return New(props as Base);
  };
}
