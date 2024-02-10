import React, { Fragment, useEffect, useState } from "react";
import { isServerSide } from "~/lib/fn";

const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/g;

const isMobileUserAgent = (userAgent: string) => regex.test(userAgent);

type Fn = () => any;

declare global {
  interface Navigator {
    userAgentData?: { mobile?: boolean };
  }
}

const isMobileDevice = (ua: string) => {
  if (window.navigator.userAgentData?.mobile) return true;
  if (isMobileUserAgent(ua)) return true;
  if (
    "maxTouchPoints" in window.navigator &&
    window.navigator.maxTouchPoints > 0
  )
    return true;
  return window.navigator.userAgentData?.mobile === false;
};

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    isServerSide() ? false : isMobileDevice(window.navigator.userAgent),
  );
  useEffect(() => {
    const onResize = () =>
      setIsMobile(isMobileDevice(window.navigator.userAgent));
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

export const PlatformMobile = (props: React.PropsWithChildren) => (
  <ShouldRender when={useMobile()} children={props.children} />
);

export const PlatformDesktop = (props: React.PropsWithChildren) => (
  <ShouldRender when={!useMobile()} children={props.children} />
);

Platform.use = useMobile;

Platform.isMobile = () => isMobileDevice(window.navigator.userAgent);

export enum Platforms {
  Mobile = "mobile",
  PC = "pc",
}

export const DesktopSize = 1024;
