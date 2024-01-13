import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import { Entity } from "~/models/entity";

export type Product = Entity.New<{
  name: string;
  price: number;
  monetary: string;
  quantity: number;
}>;

export namespace Product {
  export const schema = z.object({
    ...Entity.schema.shape,
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
    quantity: 1,
  });
}
