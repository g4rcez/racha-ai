import React from "react";
import { css } from "~/lib/dom";
import { Label } from "~/types";

type Props = React.ComponentProps<"input"> & {
    children: Label;
    container?: string;
};
export const Checkbox = ({ children, container, className, ...props }: Props) => {
    return (
        <fieldset aria-disabled={props.disabled} disabled={props.disabled} className={css("group", container)}>
            <label
                className={css(
                    "group flex cursor-pointer items-center gap-2 group-disabled:cursor-not-allowed group-disabled:text-muted-input",
                    className,
                )}
            >
                <input
                    {...props}
                    type="checkbox"
                    className="form-checkbox cursor-pointer rounded-xs border text-main-bg outline-main-bg focus:ring-main-bg disabled:cursor-not-allowed group-disabled:text-muted-input"
                />
                <span>{children}</span>
            </label>
        </fieldset>
    );
};
