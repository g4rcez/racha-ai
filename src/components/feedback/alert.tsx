import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangleIcon, BadgeCheckIcon, BadgeInfoIcon } from "lucide-react";
import React, { forwardRef } from "react";
import { Polymorph, PolymorphicProps } from "~/components/core/polymorph";
import { css } from "~/lib/dom";
import { isReactComponent } from "~/lib/react";
import { Label } from "~/types";

const variants = cva("flex flex-col gap-2 p-4 rounded border border-transparent w-full", {
    variants: {
        theme: {
            warn: "bg-warn-bg/20 text-warn-bg border-warn",
            success: "bg-success-bg border-success-bg",
            info: "bg-success-bg border-success-bg"
        }
    },
    defaultVariants: { theme: "info" }
});

type Variants = VariantProps<typeof variants>;

export type AlertProps<T extends React.ElementType = "button"> = PolymorphicProps<Variants & Partial<{ icon: Label; title: Label }>, T>;

const iconMap: Record<NonNullable<Variants["theme"]>, any> = {
    warn: AlertTriangleIcon,
    success: BadgeCheckIcon,
    info: BadgeInfoIcon
};

export const Alert: <T extends React.ElementType = "div">(props: AlertProps<T>) => any = forwardRef(function Alert(
    { className, title, icon, theme, ...props }: AlertProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const JsxIcon = icon ? icon : iconMap[theme! || "info"];
    return (
        <Polymorph {...props} role="alert" as={props.as ?? "div"} ref={ref} className={css(variants({ theme, className }))}>
            {icon || title ? (
                <header className="flex gap-2 text-lg">
                    {isReactComponent(JsxIcon) ? <JsxIcon /> : JsxIcon}
                    {title}
                </header>
            ) : null}
            <section>{props.children}</section>
        </Polymorph>
    );
}) as never;
