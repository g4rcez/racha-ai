import { parse } from "qs";
import React from "react";
import { NullToUndefined } from "~/types";

export const Form = (props: React.ComponentProps<"form">) => (
    <form
        {...props}
        onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit?.(e);
        }}
    />
);

type Recursive<T, Key extends keyof T> = Key extends string
    ? T[Key] extends Date
        ? Key
        : T[Key] extends Record<string, any>
          ?
                | `${Key}.${Recursive<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
                | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
          : never
    : never;

type Paths<T> = Recursive<T, keyof T> | keyof T;

export type Path<T> = Paths<T> extends string | keyof T ? Paths<T> : keyof T;

type RecNTU<T> = {
    [K in keyof T]: T[K] extends {} ? RecNTU<T[K]> : T[K] extends any[] ? RecNTU<T[K]> : NullToUndefined<T[K]>;
};

export const formToJson = <T extends any>(form: HTMLFormElement): RecNTU<T> => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), {
        allowDots: true,
        charset: "utf-8",
        parseArrays: true,
        plainObjects: true,
        charsetSentinel: true,
        allowPrototypes: false,
        depth: Number.MAX_SAFE_INTEGER,
        arrayLimit: Number.MAX_SAFE_INTEGER,
        parameterLimit: Number.MAX_SAFE_INTEGER
    }) as never;
};
