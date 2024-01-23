import React, { Fragment } from "react";

const isMobile = () => {
  const userAgent = navigator.userAgent;
  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = Boolean(userAgent.match(/IEMobile/i));
  return Boolean(isAndroid || isIos || isOpera || isWindows);
};

type Fn = () => any;
export const Platform = <PC extends Fn, Smart extends Fn>(
  fns: Partial<{ mobile: Smart; pc: PC }> = {},
) => (isMobile() ? fns.mobile?.() : fns.pc?.());

const ShouldRender = (props: React.PropsWithChildren<{ when: boolean }>) =>
  props.when ? <Fragment>{props.children}</Fragment> : null;

Platform.mobile = (props: React.PropsWithChildren) => (
  <ShouldRender when={isMobile()} children={props.children} />
);

Platform.desktop = (props: React.PropsWithChildren) => (
  <ShouldRender when={!isMobile()} children={props.children} />
);

Platform.use = () => isMobile();

Platform.is = isMobile;
