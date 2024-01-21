import React, { Fragment } from "react";

const isMobile = () => {
  const userAgent = navigator.userAgent;
  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = Boolean(userAgent.match(/IEMobile/i));
  return Boolean(isAndroid || isIos || isOpera || isWindows);
};

export const Mobile = (props: React.PropsWithChildren) =>
  isMobile() ? <Fragment>{props.children}</Fragment> : null;

Mobile.use = () => {
  return isMobile();
};

type Fn = () => any;

export const Platform = <PC extends Fn, Smart extends Fn>(
  fns: Partial<{ mobile: Smart; pc: PC }> = {},
) => (isMobile() ? fns.mobile?.() : fns.pc?.());

Mobile.is = isMobile;
