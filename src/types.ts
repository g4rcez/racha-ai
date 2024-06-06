import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Dict } from "~/lib/dict";

export type FN = (...a: any[]) => any;

export type Override<Source, New> = Omit<Source, keyof New> & New;

export type Label = string | ReactNode | ReactElement;

export type LooseString<T extends string> = T | Omit<string, T>;

export type NullToUndefined<T> = T extends null ? undefined : T;

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: T[P] extends Date ? T[P] : T[P] extends any[] ? T[P] | undefined : DeepPartial<T[P]>;
      }
    : T;

export type ParseToRaw<T> = {
    [K in keyof T]: T[K] extends Dict<any, infer Value> ? ParseToRaw<Value>[] : Date extends T[K] ? (null extends T[K] ? string | null : T[K] extends Date ? string : T[K]) : T[K];
};

export type Nullable<T> = T | null;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement, session: any) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export type PrimitiveProps<T extends object> = {
    [P in keyof T as T[P] extends Function ? never : P]: T[P];
};

export type DbOrderItem = {
    id: string;
    productId: string;
    splitType: string;
    title: string;
    category: string;
    orderId: string;
    ownerId: string;
    type: string;
    price: string;
    quantity: string;
    total: string;
    createdAt: Date;
};

export type DbPayments = {
    id: string;
    status: string;
    orderId: string;
    ownerId: string;
    amount: string;
    createdAt: Date;
};

export type DbOrder = {
    id: string;
    title: string;
    createdAt: Date;
    lastUpdatedAt: Date | null;
    total: string;
    type: string;
    category: string;
    status: string;
    currencyCode: string;
    metadata: Record<string, any>;
    ownerId: string;
};

export type DbUser = {
    id: string;
    image: string;
    name: string;
    email: string;
    preferences: Record<string, any>;
    createdAt: Date;
};

export type OrderItemMetadata = DbOrderItem & { consumed: number };