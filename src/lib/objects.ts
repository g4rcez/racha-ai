import { z } from "zod";

export namespace Objects {
    const helper = <T extends object>(obj: any | T, path: string[], value: any) => {
        const [current, ...rest] = path;
        if (rest.length > 0) {
            if (!obj[current]) {
                const isNumber = `${+rest[0]}` === rest[0];
                obj[current] = isNumber ? [] : {};
            }
            if (typeof obj[current] !== "object") {
                const isNumber = `${+rest[0]}` === rest[0];
                obj[current] = helper(isNumber ? [] : {}, rest, value);
            } else obj[current] = helper(obj[current], rest, value);
        } else obj[current] = value;
        return obj;
    };

    export const pathTo = (path: string) => (path as string).replace("[", ".").replace("]", "").split(".");

    export const set = <O extends object>(o: O, path: AllPaths<O> | Array<string | number> | string, value: any) => {
        const pathArr = Array.isArray(path) ? path : pathTo(path);
        const obj = structuredClone(o);
        helper(obj, pathArr as string[], value);
        return obj;
    };

    export const getSchemaShape = <T extends z.ZodObject<any>>(name: string, schema: T) =>
        pathTo(name).reduce((acc, el) => {
            if (el === "") return acc;
            return acc.shape[el];
        }, schema);

    export const getValidationMessage = <T extends z.ZodObject<any>>(schema: T, value: any, name: string): string => {
        const rule = getSchemaShape(name, schema);
        const validation = rule.safeParse(value);
        if (validation.success) return "";
        return validation.error.issues[0].message;
    };

    type Primitives = bigint | boolean | string | number | null | undefined | symbol;

    type N<T> = T extends `${infer n extends bigint | number}` ? n : never;

    type Keys<T> = T extends readonly unknown[] ? ({ [K in keyof T]: K }[number] extends infer R ? (R extends string ? N<R> & keyof T : R & keyof T) : never) : keyof T;

    type JoinPath<A extends string, B extends string, Sep extends string = ""> = [A] extends [never] ? B : [B] extends [never] ? A : `${A}${Sep}${B}`;

    export type AllPaths<T, ParentPath extends string = never> = T extends Primitives
        ? ParentPath
        : unknown extends T
          ? JoinPath<ParentPath, string, ".">
          : T extends readonly any[]
            ? Keys<T> extends infer key extends string | number
                ? JoinPath<ParentPath, `[${key}]`> | AllPaths<T[number], JoinPath<ParentPath, `[${key}]`>>
                : never
            : keyof T extends infer key extends keyof T & string
              ? key extends any
                  ? JoinPath<ParentPath, key, "."> | AllPaths<T[key], JoinPath<ParentPath, key, ".">>
                  : never
              : ParentPath;

    export const getPath = <T extends any>(obj: T, path: string | string[], defValue?: any) => {
        if (!path) return undefined;
        const pathArray: any = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
        const result = pathArray.reduce((prevObj: any, key: any) => prevObj && prevObj[key], obj);
        return result === undefined ? defValue : result;
    };

    const isObject = (a: any): a is Object => typeof a === "object";

    const equals = (a: any, b: any): boolean => {
        if (a === b) {
            return true;
        }
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }
        if (!a || !b || (!isObject(a) && !isObject(b))) {
            return a === b;
        }
        if (a.prototype !== b.prototype) {
            return false;
        }
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }
        return keys.every((k) => equals(a[k], b[k]));
    };

    export const diff = <T extends any, Keys extends AllPaths<T>[]>(a: T, b: T, keys: Keys) => keys.some((x) => !equals(getPath(a, x), getPath(b, x)));

    export const keys = <T extends object>(t: T): Array<keyof T> => Object.keys(t) as any;

    export const merge = <A extends any, B extends any = A>(target: A, source: B): A & B => {
        let output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            keys(source).forEach((key) => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, { [key]: source[key] });
                    else (output as any)[key] = merge((target as any)[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output as A & B;
    };
}
