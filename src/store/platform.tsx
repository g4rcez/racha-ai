import React, { Fragment, useEffect, useState } from "react";
import { Is } from "~/lib/is";

const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/g;

const isMobileUserAgent = (userAgent: string) => regex.test(userAgent);

type Fn = () => any;

const testMobileSize = (n: number) => n <= 640;

const isMobileDevice = (size?: number) => {
  if (Is.function(navigator.share)) return true;
  if (isMobileUserAgent(window.navigator.userAgent)) return true;
  if (Is.number(size)) return testMobileSize(size);
  return false;
};

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice);
  useEffect(() => {
    const onResize = () => setIsMobile(isMobileDevice(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

export const Platform = <PC extends Fn, Smart extends Fn>(
  fns: Partial<{ mobile: Smart; pc: PC }> = {},
) => (useMobile() ? fns.mobile?.() : fns.pc?.());

const ShouldRender = (props: React.PropsWithChildren<{ when: boolean }>) =>
  props.when ? <Fragment>{props.children}</Fragment> : null;

Platform.mobile = (props: React.PropsWithChildren) => (
  <ShouldRender when={useMobile()} children={props.children} />
);

Platform.desktop = (props: React.PropsWithChildren) => (
  <ShouldRender when={!useMobile()} children={props.children} />
);

Platform.use = useMobile;

Platform.is = () => isMobileDevice(window.innerWidth);
