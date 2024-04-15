import React from "react";
import { PolymorphicProps } from "~/components/core/polymorph";
import { css } from "~/lib/dom";
import { Form } from "~/components/form/form";

type Props = PolymorphicProps<
  { description?: string },
  "div" | "section" | "article" | "nav" | "ul" | "form" | typeof Form
>;

export const Card = ({ as, description, title, ...props }: Props) => {
  const Component = as || "div";
  return (
    <Component
      {...(props as any)}
      className={css(
        "w-full rounded-lg p-6 bg-card-bg shadow border border-card-border",
        props.className,
      )}
    >
      {title ? (
        <header className="min-w-full mb-4">
          <h2 className="text-xl font-medium tracking-wide leading-relaxed">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-balance text-xs">{description}</p>
          ) : null}
        </header>
      ) : null}
      {props.children}
    </Component>
  );
};
