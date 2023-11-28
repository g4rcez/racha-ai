import { LocalStorage } from "storage-manager-js";

type Parsers<State extends {}, V extends string> = {
    [K in V]: (a: any) => State;
} & {
    [K in string]: (a: any) => State;
};

export const createStorageMiddleware = <State extends {}, V extends string = string>(
    name: string,
    version: V,
    parsers: Parsers<State, V>
) => {
    const key = `@app/${name}-${version}`;
    return {
        get: () => parsers[version](LocalStorage.get(key)),
        middleware: <S>(state: S): S => {
            LocalStorage.set(key, state);
            return state;
        }
    };
};
