import React, { forwardRef } from "react";

export type FormError = {
  path: string;
  message: string;
};

export const Form = forwardRef(
  (
    props: React.ComponentProps<"form">,
    ref: React.ForwardedRef<HTMLFormElement>,
  ) => (
    <form
      {...props}
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
    />
  ),
);
