import React, { LegacyRef, MutableRefObject, RefCallback } from "react";

export const mergeRefs =
  <T extends any = any>(
    ...refs: Array<MutableRefObject<T> | LegacyRef<T> | undefined | null>
  ): RefCallback<T> =>
  (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };

export const isReactComponent = (a: any): a is React.FC => {
  if (a.$$typeof === Symbol.for("react.forward_ref")) {
    return true;
  }
  if (a.$$typeof === Symbol.for("react.fragment")) {
    return true;
  }
  return a.$$typeof === Symbol.for("react.element");
};
