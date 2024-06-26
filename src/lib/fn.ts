export const reduceObject = <T extends {}, V>(object: T, fn: <K extends keyof T>(k: K, value: T[K]) => V) =>
    Object.keys(object).reduce(
        (acc, el) => ({
            ...acc,
            [el]: fn(el as keyof T, object[el as keyof T])
        }),
        {}
    );

const getEntries = (o: object, prefix = ""): [any, any][] => Object.entries(o).flatMap(([k, v]) => (Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));

export const flatTuples = <K, V>(input: object): [K, V][] => getEntries(input);

export const onlyNumbers = (s: string) => s.replace(/[^0-9.]/g, "");

export const fromStrNumber = (n: string) => Number(onlyNumbers(n.replace(/,/g, ".").replace(/(.*)\./g, (x) => `${x.replace(/\./g, "")}.`)));

export const noop = { fn: <T>(t: T): T => t, array: [], obj: {} };

export const isServerSide = () => typeof window === "undefined";
