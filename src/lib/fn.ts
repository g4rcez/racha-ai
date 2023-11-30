import { uuidv7 } from "@kripod/uuidv7";
import { z } from "zod";
import { Is } from "~/lib/is";

export const reduceObject = <T extends {}, V>(object: T, fn: <K extends keyof T>(k: K, value: T[K]) => V) =>
    Object.keys(object).reduce(
        (acc, el) => ({
            ...acc,
            [el]: fn(el as keyof T, object[el as keyof T])
        }),
        {}
    );

const getEntries = (o: object, prefix = ""): [any, any][] =>
    Object.entries(o).flatMap(([k, v]) => (Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));

export const flatTuples = <K, V>(input: object): [K, V][] => getEntries(input);

export const noop = <T>(a: T): T => a;

export const uuid = uuidv7;

export const sanitize = (str: string) => str.trim().normalize("NFKD");

export const parseFromSchema = <Z extends z.ZodDefault<z.ZodType>>(a: any, schema: Z) => {
    const result = schema.safeParse(a);
    console.log(result);
    return result.success ? result.data : schema._def.defaultValue();
};

export const sortUuidList = <T, K extends keyof T>(list: T[], key: K, order: "asc" | "desc" = "desc") => {
    const sorted = list.toSorted((a, b) => (b[key] as string).localeCompare(a[key] as string));
    return order === "asc" ? sorted.reverse() : sorted;
};

const isObject = (object: any): object is object => Object.prototype.toString.call(object) === "[object Object]";

export const deepMerge = <T extends object>(defaults: T, settings: T) => {
    Object.keys(defaults).forEach(function (key_default) {
        const value = (settings as any)[key_default];
        if (Is.undefined(value)) {
            (settings as any)[key_default] = value;
        } else if (isObject(value) && isObject(value)) {
            deepMerge(value, value);
        }
    });
    return settings;
};

export const fromMoneyToNumber = (n: string) => {
    return Number(
        n
            .replace(/,/g, ".")
            .replace(/(.*)\./g, (x) => `${x.replace(/\./g, "")}.`)
            .replace(/[^0-9.]/g, "")
    );
};

export const keys: <O>(o: O) => Array<keyof O> = Object.keys;
