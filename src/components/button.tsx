import { cva, type VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { Polymorph, PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";

const buttonVariants = cva(
    "inline-flex gap-1.5 text-button border-2 items-center hover:bg-opacity-80 justify-center align-middle cursor-pointer whitespace-nowrap font-medium transition-colors ease-in disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:text-opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm",
    {
        variants: {
            size: { default: "h-10 lg:h-12 px-3 py-2", big: "h-12 px-6 py-4", small: "h-8 px-2 py-1" },
            rounded: { default: "rounded-md", rough: "rounded-sm", circle: "rounded-full" },
            theme: {
                main: "bg-main-bg border-main-bg",
                warn: "bg-warn-bg border-warn-bg",
                success: "bg-success-bg border-success-bg",
                accent: "bg-accent-bg border-accent-bg",
                danger: "bg-danger-bg border-danger-bg"
            },
        },
        defaultVariants: { theme: "main", size: "default", rounded: "default" }
    }
);

export type ButtonProps = PolymorphicProps<VariantProps<typeof buttonVariants> & {}, "button">;

export const Button = forwardRef(function Button(
    { className, theme, type = "button", size, rounded, ...props }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) {
    return (
        <Polymorph
            {...props}
            as="button"
            type={type}
            ref={ref}
            className={css(buttonVariants({ theme, size, className, rounded }))}
        />
    );
});
