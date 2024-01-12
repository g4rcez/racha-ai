import { useEffect } from "react";

export const useConsole = <A>(a: A) => {
  useEffect(() => {
    console.log(a);
  }, [a]);
};
