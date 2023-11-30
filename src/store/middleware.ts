import { LocalStorage } from "storage-manager-js";
import { z } from "zod";
import { keys, parseFromSchema } from "~/lib/fn";

type ZOD = z.ZodDefault<z.ZodType>;

type Schemas = {
    [K in string]: ZOD;
};

type Parsers<State, P> = {
    [K in keyof P]: (a: any) => State;
};

export const createStorageMiddleware = <State extends {}, P extends Schemas, V extends keyof P>(
    name: string,
    parsers: P,
    version: V
) => {
    const key = `@app/${name}-${version as string}`;
    const validationParsers = keys(parsers).reduce(
        (acc, el) => ({
            ...acc,
            [el]: (a: any) => parseFromSchema(a, parsers[el])
        }),
        {} as Parsers<State, P>
    );
    return {
        get: (): z.infer<P[V]> => validationParsers[version](LocalStorage.get(key)),
        middleware: <S>(state: S): S => {
            LocalStorage.set(key, state);
            return state;
        }
    };
};
