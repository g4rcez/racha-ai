import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { Polymorph, PolymorphicProps } from "~/components/core/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

const buttonVariants = cva(
  "inline-flex gap-1.5 text-button border-2 border-transparent items-center hover:bg-opacity-80 justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        big: "h-12 px-6 py-4",
        small: "h-8 p-2",
        medium: "h-11 p-2",
        icon: "p-1",
      },
      rounded: {
        default: "rounded-md",
        rough: "rounded-sm",
        circle: "rounded-full aspect-square",
      },
      theme: {
        transparent: "bg-transparent",
        "transparent-danger": "bg-transparent text-danger-bg",
        main: "bg-main-bg border-main-bg",
        warn: "bg-warn-bg border-warn-bg",
        success: "bg-success-bg border-success-bg",
        accent: "bg-accent-bg border-accent-bg",
        danger: "bg-danger-bg border-danger-bg",
        muted: "bg-muted-bg border-muted-bg",
      },
    },
    defaultVariants: { theme: "main", size: "default", rounded: "default" },
  },
);

export type ButtonProps<T extends React.ElementType = "button"> =
  PolymorphicProps<
    VariantProps<typeof buttonVariants> &
      Partial<{
        icon: Label;
      }>,
    T
  >;

export const Button: <T extends React.ElementType = "button">(
  props: ButtonProps<T>,
) => any = forwardRef(function Button(
  {
    className,
    icon,
    theme,
    type = "button",
    size,
    rounded,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Polymorph
      {...props}
      ref={ref}
      type={type}
      data-theme={theme}
      as={props.as ?? "button"}
      className={css(buttonVariants({ theme, size, rounded }), className)}
    >
      {props.children}
      {icon}
    </Polymorph>
  );
}) as never;

type Props = {
  active: string;
  buttons: ButtonProps[];
};

export const ButtonGroup = (props: Props) => (
  <ul className="flex-row w-full border-2 rounded-md border-main-bg text-main-bg flex">
    {props.buttons.map((button) => (
      <li key={`button-group-${button.name}`} className="flex flex-1">
        <button
          {...button}
          type={button.type || "button"}
          data-active={props.active === button.name ? "true" : "false"}
          className={css(
            "flex rounded-sm flex-1 gap-1.5 items-center hover:bg-opacity-80 px-4 py-2 border-r-2 last:border-r-0 border-main-bg",
            "justify-center align-middle cursor-pointer whitespace-nowrap font-medium hover:bg-main-bg hover:text-main",
            "disabled:text-opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm",
            "transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50 data-[active=true]:bg-main-bg text-body data-[active=true]:text-main",
          )}
        />
      </li>
    ))}
  </ul>
);
