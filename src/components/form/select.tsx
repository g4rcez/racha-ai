"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import { InputField, InputFieldProps } from "~/components/form/input-field";
import { css } from "~/lib/dom";
import { mergeRefs } from "~/lib/react";

export type SelectProps = InputFieldProps<"select"> & { options: React.ComponentProps<"option">[] };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ container, options, ...props }: SelectProps, ref) => {
        const inputRef = useRef<HTMLSelectElement>(null);
        const id = props.id ?? props.name;

        useEffect(() => {
            if (inputRef.current === null) return;
            const input = inputRef.current;
            const focus = () => input.setAttribute("data-initialized", "true");
            input.addEventListener("focus", focus);
            return () => input.removeEventListener("focus", focus);
        }, []);

        return (
            <InputField<"select"> {...(props as any)} container={css("group inline-block w-full", container)}>
                <select
                    {...props}
                    ref={mergeRefs(ref, inputRef)}
                    defaultValue=""
                    className={css(
                        "input select group h-10 w-full flex-1 rounded-md p-2 placeholder-input-mask outline-none transition-colors group-error:text-danger group-error:placeholder-danger-mask",
                        props.className
                    )}
                    id={id}
                    name={id}
                >
                    {options.map((option) => (
                        <option key={`${id}-select-option-${option.value}`} {...option} />
                    ))}
                </select>
            </InputField>
        );
    }
);
