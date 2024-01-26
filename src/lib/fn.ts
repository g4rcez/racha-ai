import { uuidv7 } from "@kripod/uuidv7";
import Fraction from "fraction.js";
import React from "react";
import { Is } from "~/lib/is";

export const reduceObject = <T extends {}, V>(
  object: T,
  fn: <K extends keyof T>(k: K, value: T[K]) => V,
) =>
  Object.keys(object).reduce(
    (acc, el) => ({
      ...acc,
      [el]: fn(el as keyof T, object[el as keyof T]),
    }),
    {},
  );

const getEntries = (o: object, prefix = ""): [any, any][] =>
  Object.entries(o).flatMap(([k, v]) =>
    Object(v) === v ? getEntries(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );

export const flatTuples = <K, V>(input: object): [K, V][] => getEntries(input);

export const uuid = uuidv7;

export const sanitize = (str: string) => str.trim().normalize("NFKD");

export const parseFromSchema = (a: any, schema: any) => {
  const result = schema.safeParse(a);
  return result.success ? result.data : schema._def.defaultValue();
};

export const sortUuidList = <T, K extends keyof T>(
  list: T[],
  key: K,
  order: "asc" | "desc" = "desc",
) => {
  const pow = order === "asc" ? -1 : 1;
  return list.toSorted(
    (a, b) => (b[key] as string).localeCompare(a[key] as string) * pow,
  );
};

const isObject = (object: any): object is object =>
  Object.prototype.toString.call(object) === "[object Object]";

export const deepMerge = <T extends object>(defaults: T, settings: T) => {
  Object.keys(defaults).forEach(function (key_default) {
    const value = (settings as any)[key_default];
    if (Is.undefined(value)) {
      (settings as any)[key_default] = value;
    } else if (isObject(value) && isObject(value)) {
      deepMerge(value, value);
    }
  });
  return settings;
};

export const onlyNumbers = (s: string) => s.replace(/[^0-9.]/g, "");

export const fromStrNumber = (n: string) =>
  Number(
    onlyNumbers(
      n
        .replace(/,/g, ".")
        .replace(/(.*)\./g, (x) => `${x.replace(/\./g, "")}.`),
    ),
  );

export const keys: <O>(o: O) => Array<keyof O> = Object.keys;

export const sum = (a: number, b: number) => a + b;
export const diff = (a: number, b: number) => a - b;

export const clamp = (min: number, average: number, max: number) =>
  Math.max(Math.min(max, average), min);

export const isReactComponent = (a: any): a is React.FC => {
  if (a.$$typeof === Symbol.for("react.forward_ref")) {
    return true;
  }
  if (a.$$typeof === Symbol.for("react.fragment")) {
    return true;
  }
  return a.$$typeof === Symbol.for("react.element");
};

export const fixed = (n: number, decimalPlaces: number = 2) =>
  Number(n.toFixed(decimalPlaces));

export const sortId = <A extends { id: string }>(a: A, b: A) =>
  b.id.localeCompare(a.id);

export const fraction = (a: number, b: number): string =>
  new Fraction(a, b).toFraction();

export const toFraction = (a: number): string =>
  new Fraction(a).toFraction(true).replace(" ", " + ");

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const noop = {
  fn: <T>(t: T): T => t,
  array: [],
  obj: {},
};

export const isServerSide = () => typeof window === "undefined";

export const normalize = (str: string) => str.normalize("NFKD").trim();
