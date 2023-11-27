import React from "react";
import { Locales } from "the-mask-input";
import type { createFormatters } from "~/i18n/polyglot/parser";
import { CurrencyCode } from "~/i18n/polyglot/types/currency";
import { Unit } from "~/i18n/polyglot/types/unit";

export type Label = string | React.ReactElement | React.ReactNode;

export type GenericTranslationFn = (props: any, options?: PolyglotFullConfig) => any;

export type TranslationMap = Record<string, Label | GenericTranslationFn>;

export type Timezone = { label: string; offset: number };

type DateFormat = Partial<{
    day: "numeric" | "2-digit";
    era: "long" | "short" | "narrow";
    formatMatcher: "best fit" | "basic";
    hour12: boolean;
    hour: "numeric" | "2-digit";
    localeMatcher: "best fit" | "lookup";
    minute: "numeric" | "2-digit";
    month: "numeric" | "2-digit" | "long" | "short" | "narrow";
    second: "numeric" | "2-digit";
    timeZone: string;
    timeZoneName: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric";
    weekday: "long" | "short" | "narrow";
    year: "numeric" | "2-digit";
}>;

type NumberFormat = Partial<{
    currency: string;
    currencySign: string;
    localeMatcher: string;
    maximumFractionDigits: number;
    maximumSignificantDigits: number;
    minimumFractionDigits: number;
    minimumIntegerDigits: number;
    minimumSignificantDigits: number;
    useGrouping: boolean;
}>;

export type PolyglotConfig = Partial<{
    date: DateFormat;
    timezone: string;
    datetime: DateFormat;
    money: NumberFormat;
    number: NumberFormat;
    percent: NumberFormat;
    time: DateFormat;
    unit: Omit<NumberFormat, "currency" | "currencySign"> & {
        type: Unit;
        display?: "short" | "long" | "narrow";
    };
    currency: Omit<NumberFormat, "currency" | "currencySign"> &
        Partial<{
            code: CurrencyCode;
            sign: "accounting" | "standard";
            display: "code" | "symbol" | "narrowSymbol" | "name";
        }>;
}>;

export type PolyglotFullConfig = Partial<
    PolyglotConfig & {
        languages: Partial<Record<Locales, PolyglotConfig>>;
        fallback: string;
    }
>;

type Fmt = ReturnType<typeof createFormatters>;
type Formatters = {
    [K in keyof Fmt]: Parameters<Fmt[K]>[0];
};

type ExtractFormatter<
    Key extends string,
    Sentence extends string
> = Sentence extends `${infer _}{{${Key}|${infer F}}}${infer _}`
    ? F extends keyof Formatters
        ? Formatters[F]
        : F
    : unknown;

export type ExtractVariables<T extends string> = string extends T
    ? Record<string, string>
    : T extends `${infer _}{{${infer R}}}${infer Rest}`
      ? R extends `${infer Variable}|${infer _}`
          ? { [K in Variable | keyof ExtractVariables<Rest>]: K extends string ? ExtractFormatter<K, T> : unknown }
          : R extends `${infer Variable}`
            ? { [k in Variable]: R }
            : {}
      : {};
