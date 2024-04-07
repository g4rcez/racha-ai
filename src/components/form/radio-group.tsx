import * as Radio from "@radix-ui/react-radio-group";
import React from "react";
import { Label, Override } from "~/types";

type Value = { value: string; label: Label; description?: Label };

type Props<T extends readonly Value[]> = Override<
  React.ComponentProps<"input">,
  {
    values: T;
    title: Label;
    ariaLabel: string;
    defaultValue?: T[number]["value"];
    onValueChange?: (value: T[number]["value"]) => void;
  }
>;

export const RadioGroup = <const T extends readonly Value[]>({
  title,
  ariaLabel,
  values,
  ...props
}: Props<T>) => {
  return (
    <fieldset className="block w-full">
      <label className="mb-3 block text-base text-balance font-medium">
        {title}
      </label>
      <Radio.Root
        {...(props as any)}
        className="flex flex-col gap-4"
        aria-label={ariaLabel}
      >
        {values.map((item) => (
          <label key={item.value} className="group flex items-center gap-2">
            <Radio.Item
              id={item.value}
              value={item.value}
              className="h-5 w-5 cursor-default rounded-full border bg-white hover:bg-main data-[state=checked]:border-main-bg"
            >
              <Radio.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2.5 after:w-2.5 after:rounded-[50%] after:bg-main-bg after:content-['']" />
            </Radio.Item>
            <label className="text-sm leading-none" htmlFor={item.value}>
              {item.label}
            </label>
          </label>
        ))}
      </Radio.Root>
    </fieldset>
  );
};
