import { z } from "zod";
import { uuid } from "~/lib/fn";
import { DeepPartial } from "~/types";

type Constructor = { id: string; createdAt: Date };

export abstract class Entity {
    protected static _schema = {
        id: z.string().uuid(),
        createdAt: z.date().or(
            z
                .string()
                .datetime()
                .transform((x) => new Date(x))
        )
    };
    public readonly id: string;
    public readonly createdAt: Date;

    protected constructor(e: DeepPartial<Constructor & any>) {
        this.id = e?.id ?? uuid();
        this.createdAt = e?.createdAt ?? new Date();
    }

    public abstract clone(): void;
}
