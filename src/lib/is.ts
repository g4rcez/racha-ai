const array = <T = any>(a: any): a is T[] => Array.isArray(a);

type Fn = (...any: any[]) => any

export const Is = {
    array,
    string: (a: any): a is string => typeof a === "string",
    object: <T = object>(a: any): a is T => !array(a) && typeof a === "object",
    undefined: (a: any): a is undefined => a === undefined,
    function: (a: any): a is Fn => typeof a === "function",
    keyof: <T extends {}>(o: T, k: any): k is keyof T => Object.prototype.hasOwnProperty.call(o, k)
};

