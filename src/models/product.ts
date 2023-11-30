import { z } from "zod";
import { Entity } from "~/models/entity";
import { DeepPartial } from "~/types";

export class Product extends Entity {
    public static schema = z
        .object({
            ...Entity._schema,
            name: z.string(),
            price: z.number(),
            quantity: z.number().int()
        })
        .transform((x) => new Product(x as never))
        .default(new Product());
    public name: string;
    public price: number;
    public quantity: number;

    public constructor(product?: DeepPartial<Product>) {
        super(product);
        this.name = product?.name ?? "";
        this.price = product?.price ?? 0;
        this.quantity = product?.quantity ?? 1;
    }

    clone(): Product {
        return new Product(this);
    }
}
