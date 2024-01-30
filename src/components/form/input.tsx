import { forwardRef, useEffect, useRef } from "react";
import MaskInput, { TheMaskProps } from "the-mask-input";
import { FeedbackProps } from "~/components/form/input-feedback";
import { InputField, InputFieldProps } from "~/components/form/input-field";
import { css } from "~/lib/dom";
import { mergeRefs } from "~/lib/react";

export type InputProps = InputFieldProps<"input"> &
  TheMaskProps &
  FeedbackProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      container,
      rightLabel,
      optionalText,
      hideLeft = false,
      ...props
    }: InputProps,
    ref,
  ) => {
    const id = props.id ?? props.name;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current === null) return;
      const input = inputRef.current;
      const focus = () => input.setAttribute("data-initialized", "true");
      input.addEventListener("focus", focus);
      return () => input.removeEventListener("focus", focus);
    }, []);

    return (
      <InputField<"input">
        {...(props as any)}
        hideLeft={hideLeft}
        rightLabel={rightLabel}
        optionalText={optionalText}
        container={css("group inline-block w-full", container)}
      >
        <MaskInput
          {...props}
          type={type}
          ref={mergeRefs(ref, inputRef)}
          id={id}
          name={id}
          className={css(
            "input group h-10 w-full flex-1 rounded-md bg-transparent p-2 placeholder-input-mask outline-none transition-colors group-error:text-danger group-error:placeholder-danger-mask",
            props.className,
          )}
        />
      </InputField>
    );
  },
);
