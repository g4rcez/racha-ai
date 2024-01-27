"use client";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";

export const ClientSide = (
  props: PropsWithChildren<{ onLoad?: () => void }>,
) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(true);
    return props.onLoad?.();
  }, []);

  return state ? <Fragment>{props.children}</Fragment> : <Fragment />;
};
