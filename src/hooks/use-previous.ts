import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T) {
  let ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
