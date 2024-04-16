import { IParseOptions, parse } from "qs";
import React, { forwardRef } from "react";

type NullToUndefined<T> = T extends null ? undefined : T;

type RecursivePlain<T> = {
    [K in keyof T]: T[K] extends {} ? RecursivePlain<T[K]> : T[K] extends any[] ? RecursivePlain<T[K]> : NullToUndefined<T[K]>;
};

const options: IParseOptions = {
    allowDots: true,
    allowEmptyArrays: true,
    allowPrototypes: false,
    arrayLimit: Number.MAX_SAFE_INTEGER,
    charset: "utf-8",
    charsetSentinel: true,
    depth: Number.MAX_SAFE_INTEGER,
    parameterLimit: Number.MAX_SAFE_INTEGER,
    parseArrays: true,
    plainObjects: true,
    strictNullHandling: true
};

export const formToJson = <T extends any>(form: HTMLFormElement): RecursivePlain<T> => {
    const formData = new FormData(form);
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), options) as never;
};

export const Form = forwardRef((props: React.ComponentProps<"form">, ref: React.ForwardedRef<HTMLFormElement>) => (
    <form
        {...props}
        ref={ref}
        onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit?.(e);
        }}
    />
));
