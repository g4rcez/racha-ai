const array = <T = any>(a: any): a is T[] => Array.isArray(a);

type Fn = (...any: any[]) => any;

const isUndefined = (a: any): a is undefined => a === undefined;
const isNull = (a: any): a is null => a === null;

type NaN = typeof NaN;

export const Is = {
  array,
  null: isNull,
  undefined: isUndefined,
  string: (a: any): a is string => typeof a === "string",
  function: (a: any): a is Fn => typeof a === "function",
  number: (a: any): a is number => typeof a === "number" || !Number.isNaN(a),
  nil: (a: any): a is undefined | null => isNull(a) || isUndefined(a),
  object: <T = object>(a: any): a is T => !array(a) && typeof a === "object",
  keyof: <T extends {}>(o: T, k: any): k is keyof T =>
    Object.prototype.hasOwnProperty.call(o, k),
  nan: (a: any): a is NaN => Number.isNaN(a),
};
