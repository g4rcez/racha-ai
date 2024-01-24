"use client";
import { Fragment, PropsWithChildren } from "react";
import { InputFeedback } from "~/components/form/input-feedback";
import { PolymorphicProps } from "~/components/polymorph";
import { css } from "~/lib/dom";
import { Label } from "~/types";

export type InputFieldProps<T extends "input" | "select"> = PolymorphicProps<
  Partial<{
    hideLeft: boolean;
    container: string;
    left: Label;
    optionalText: string;
    right: Label;
    rightLabel: Label;
    id: string;
    name: string;
  }>,
  T
>;

export const InputField = <T extends "input" | "select">({
  optionalText = "Opcional",
  left,
  rightLabel,
  container,
  right,
  children,
  form,
  id,
  name,
  title,
  placeholder,
  hideLeft,
  required,
}: PropsWithChildren<InputFieldProps<T>>) => {
  const ID = id ?? name;
  return (
    <fieldset
      form={form}
      className={css("group inline-block w-full", container)}
    >
      <label
        form={form}
        htmlFor={ID}
        className="inline-flex w-full cursor-text flex-row flex-wrap justify-between gap-1 text-sm transition-colors group-error:text-danger"
      >
        {!hideLeft && !rightLabel ? (
          <InputFeedback
            hideLeft={hideLeft}
            reportStatus
            title={title}
            placeholder={placeholder}
          >
            {optionalText || rightLabel ? (
              <Fragment>
                {!required ? (
                  <span className="text-opacity-70">{optionalText}</span>
                ) : null}
                {rightLabel ? <Fragment>{rightLabel}</Fragment> : null}
              </Fragment>
            ) : null}
          </InputFeedback>
        ) : null}
        <div className="group flex w-full flex-row flex-nowrap items-center gap-x-2 gap-y-1 rounded-md border border-slate-300 bg-transparent transition-colors group-focus-within:border-main-bg group-hover:border-main-bg group-error:border-danger">
          {left ? (
            <span className="flex flex-nowrap gap-1 whitespace-nowrap pl-2">
              {left}
            </span>
          ) : null}
          {children}
          {right ? (
            <span className="flex flex-nowrap gap-1 whitespace-nowrap pr-2">
              {right}
            </span>
          ) : null}
        </div>
      </label>
    </fieldset>
  );
};
