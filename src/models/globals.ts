import type { User } from "~/store/friends.store";

export type Consumer = User & { consummation: string; quantity: number };

export type Hide<T extends any, K extends keyof T> = Omit<T, K>;

export enum DivisionType {
    Equality = "equality",
    Amount = "amount",
    None = "None",
    // Percent = "percent",
    // Share = "share",
    // Adjustment = "adjustment",
}

