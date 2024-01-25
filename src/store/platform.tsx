"use client";
import React, { Fragment, useEffect, useState } from "react";
import { isServerSide } from "~/lib/fn";
import { Is } from "~/lib/is";

const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/g;

const isMobileUserAgent = (userAgent: string) => regex.test(userAgent);

type Fn = () => any;

const testMobileSize = (n: number) => n <= 640;

const isMobileDevice = (ua: string, size?: number) => {
  if (isMobileUserAgent(ua)) return true;
  if (Is.number(size)) return testMobileSize(size);
  return !!Is.function(navigator.share);
};

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    isServerSide()
      ? false
      : isMobileDevice(window.navigator.userAgent, window.innerWidth),
  );
  useEffect(() => {
    const onResize = () =>
      setIsMobile(
        isMobileDevice(window.navigator.userAgent, window.innerWidth),
      );
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

Platform.is = () =>
  isMobileDevice(window.navigator.userAgent, window.innerWidth);
