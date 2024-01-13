import { useEffect } from "react";

export const useConsole = <A>(a: A) => {
  useEffect(() => {
    console.info(a);
  }, [a]);
};
