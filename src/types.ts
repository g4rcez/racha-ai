import type React from "react";

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type Label = string | React.ReactNode | React.ReactElement;

export type LooseString<T extends string> = T | Omit<string, T>;

export type NullToUndefined<T> = T extends null ? undefined : T;
