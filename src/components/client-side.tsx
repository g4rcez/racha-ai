"use client";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";

export const ClientSide = (props: PropsWithChildren) => {
  const [state, setState] = useState(false);
  useEffect(() => setState(true), []);
  return state ? <Fragment>{props.children}</Fragment> : <Fragment />;
};
