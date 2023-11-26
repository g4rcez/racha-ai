import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const css = (...styles: ClassValue[]) => twMerge(clsx(styles));

export const createElement = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props?: Partial<HTMLElementTagNameMap[K]>
) => Object.assign(document.createElement(tag), props ?? {});
