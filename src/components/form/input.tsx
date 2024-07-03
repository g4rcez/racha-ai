import React, { forwardRef, useEffect, useRef } from "react";
import { Override } from "sidekicker";
import MaskInput, { TheMaskProps } from "the-mask-input";
import { FeedbackProps } from "~/components/form/input-feedback";
import { InputField, InputFieldProps } from "~/components/form/input-field";
import { css } from "~/lib/dom";
import { mergeRefs } from "~/lib/react";

export type InputProps = Override<
    InputFieldProps<"input">,
    TheMaskProps &
        FeedbackProps & {
            next?: string;
        }
>;

export const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
    ({ type = "text", container, next, rightLabel, optionalText, hideLeft = false, right, left, ...props }: InputProps, ref): any => {
        const id = props.id ?? props.name;
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (inputRef.current === null) return;
            const input = inputRef.current;
            const focus = () => input.setAttribute("data-initialized", "true");
            const goNextInputImpl = (e: Event) => {
                const event = e as KeyboardEvent;
                if (event.key === "Enter" && input.enterKeyHint === "next") {
                    const focusNext = input.getAttribute("data-next");
                    if (focusNext) {
                        const el = document.getElementById(focusNext);
                        if (el) {
                            el.focus();
                            return void event.preventDefault();
                        }
                    }
                }
            };
            input.addEventListener("keydown", goNextInputImpl);
            input.addEventListener("focus", focus);
            return () => {
                input.removeEventListener("keydown", goNextInputImpl);
                input.removeEventListener("focus", focus);
            };
        }, []);

        return (
            <InputField<"input">
                {...(props as any)}
                right={right}
                left={left}
                hideLeft={hideLeft}
                rightLabel={rightLabel}
                optionalText={optionalText}
                container={css("group inline-block w-full", container)}
            >
                <MaskInput
                    {...props}
                    type={type}
                    data-next={next}
                    ref={mergeRefs(ref, inputRef)}
                    id={id}
                    name={id}
                    className={css(
                        "input group h-10 w-full flex-1 rounded-md bg-transparent p-2 placeholder-input-mask outline-none transition-colors group-error:text-danger group-error:placeholder-danger-mask",
                        props.className
                    )}
                />
            </InputField>
        );
    }
) as any;
