import { uuidv7 } from "@kripod/uuidv7";
import { integer, number, object, string } from "valibot";
import { Entity } from "~/models/entity";

export type Product = Entity.New<{
    name: string;
    price: number;
    monetary: string;
    quantity: number;
}>;

export namespace Product {
    export const schema = object({
        name: string(),
        price: number(),
        monetary: string(),
        quantity: number([integer()]),
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
