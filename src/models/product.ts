import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import { DB } from "~/db/types";
import { i18n } from "~/i18n";
import { fromStrNumber } from "~/lib/fn";
import { Consumer, DivisionType } from "~/models/globals";
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
        quantity: z.number().int()
    });

    export const create = (): Product => ({
        createdAt: new Date(),
        id: uuidv7(),
        name: "",
        price: 0,
        monetary: "",
        quantity: 0
    });

    export const tipId = "11111111-1111-1111-1111-111111111111";

    export const couvertId = "22222222-2222-2222-2222-222222222222";

    export const isTipOrCouvert = (product: DB.OrderItem) => product.productId === tipId || product.productId === couvertId;

    export const formatQuantity = (quantity: string, product: DB.OrderItemMetadata): string => i18n.format.percent(
        ((fromStrNumber(quantity) * 100) / product.consumed / 100)
    );

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
        type: props.type || ""
    });

    export const tip = (props: Omit<DB.OrderItem, "createdAt" | "id" | "quantity" | "productId" | "title" | "price">) => {
        const newProps = props as any as Base;
        newProps.productId = tipId;
        newProps.quantity = "1";
        newProps.price = props.total;
        newProps.title = Orders.OrderItem.Additional;
        return New(newProps);
    };

    export const couvert = (props: Omit<DB.OrderItem, "createdAt" | "id" | "quantity" | "productId" | "title" | "price">) => {
        const newProps = props as any as Base;
        newProps.productId = couvertId;
        newProps.quantity = "1";
        newProps.price = props.total;
        newProps.title = Orders.OrderItem.Couvert;
        return New(props as Base);
    };

    export type ProductCalculus = (args: { quantity: number; price: number; users: Consumer[] }) => Consumer[];

    type Parse = (n: number) => string;
    const defaultParse = (n: number) => n.toString();

    const fnBase =
        (parse: Parse = defaultParse): ProductCalculus =>
        (args) => {
            const users = args.users;
            const total = args.price * args.quantity;
            if (total === 0) return users.map((x): Consumer => ({ ...x, consummation: "" }));
            const quantity = args.quantity / users.length;
            const consummation = parse(quantity * args.price);
            return users.map((x): Consumer => ({ ...x, consummation, quantity }));
        };

    export const division = {
        [DivisionType.Equality]: fnBase(),
        [DivisionType.Amount]: fnBase((n) => i18n.format.money(n))
        // [DivisionType.Percent]: fnBase,
        // [DivisionType.Share]: fnBase,
        // [DivisionType.Adjustment]: fnBase,
    } satisfies Record<string, ProductCalculus>;

    export const divisions = [
        {
            label: "Divisão por consumo",
            description: "Igualdade",
            value: DivisionType.Equality
        },
        // {
        //   label: "Fracionário",
        //   description: "Fracionário",
        //   value: DivisionType.Share,
        // },
        // {
        //   label: "Percentual",
        //   description: "Percentual",
        //   value: DivisionType.Percent,
        // },
        {
            label: "Valor absoluto",
            description: "Valor absoluto",
            value: DivisionType.Amount
        }
    ] as const;

    export type Divisions = typeof divisions;
}
