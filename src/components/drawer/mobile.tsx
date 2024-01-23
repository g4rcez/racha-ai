import {
  DialogCloseProps,
  DialogContentProps,
  DialogTriggerProps,
} from "@radix-ui/react-dialog";
import React, { ComponentProps, PropsWithChildren } from "react";
import { Drawer as Dialog } from "vaul";
import { Title } from "~/components/typography";

export const MobileDrawer = {
  Root: (
    props: PropsWithChildren<
      Partial<{ open: boolean; onChange: (b: boolean) => void }>
    >,
  ) => (
    <Dialog.Root
      {...props}
      modal
      open={props.open}
      shouldScaleBackground
      onOpenChange={props.onChange}
    >
      {props.children}
    </Dialog.Root>
  ),
  Trigger: React.forwardRef((props: DialogTriggerProps, ref: any) => (
    <Dialog.Trigger {...props} ref={ref} />
  )),
  Header: React.forwardRef((props: ComponentProps<"div">, ref: any) => (
    <header {...props} ref={ref} />
  )),
  Title: React.forwardRef((props: ComponentProps<"h1">, ref: any) => (
    <Title {...props} ref={ref} />
  )),
  Description: React.forwardRef((props: ComponentProps<"p">, ref: any) => (
    <p {...props} ref={ref} />
  )),
  Close: React.forwardRef((props: DialogCloseProps, ref: any) => (
    <Dialog.Close {...props} ref={ref} />
  )),
  Content: React.forwardRef((props: DialogContentProps, ref: any) => {
    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-20 inset-0 bg-black/40" />
        <Dialog.Content
          {...(props as any)}
          ref={ref}
          className="z-20 bg-body-bg p-6 text-body focus:outline-none flex flex-col rounded-t-[10px] h-full mt-24 max-h-[90%] fixed bottom-0 left-0 right-0"
        >
          <div className="flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            {props.children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    );
  }),
};
