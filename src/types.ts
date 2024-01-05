import type React from "react";
import { Dict } from "~/lib/dict";

export type FN = (...a: any[]) => any;

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type Label = string | React.ReactNode | React.ReactElement;

export type LooseString<T extends string> = T | Omit<string, T>;

export type NullToUndefined<T> = T extends null ? undefined : T;

export type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: T[P] extends Date ? T[P] : T[P] extends any[] ? T[P] | undefined : DeepPartial<T[P]> }
    : T;

export type ParseToRaw<T> = {
    [K in keyof T]: T[K] extends Dict<any, infer Value> ? ParseToRaw<Value>[] : T[K] extends Date ? string : T[K];
};
