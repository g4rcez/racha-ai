import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React, { ComponentProps, PropsWithChildren } from "react";
import { Button } from "~/components/button";
import { Title } from "~/components/typography";
import { css } from "~/lib/dom";

export const DesktopDrawer = {
  Root: (
    props: PropsWithChildren<
      Partial<{ open: boolean; onChange: (b: boolean) => void }>
    >,
  ) => (
    <Dialog.Root
      {...props}
      modal
      open={props.open}
      onOpenChange={props.onChange}
    >
      {props.children}
    </Dialog.Root>
  ),
  Trigger: React.forwardRef((props: Dialog.DialogTriggerProps, ref: any) => (
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
  Close: React.forwardRef((props: Dialog.DialogCloseProps, ref: any) => (
    <Dialog.Close {...props} ref={ref} />
  )),
  Content: React.forwardRef((props: Dialog.DialogContentProps, ref: any) => {
    return (
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <div className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_300ms]" />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <div
            ref={ref}
            className={css(
              "origin-bottom overflow-y-auto max-w-[90vw] sm:max-h-screen rounded-l-md",
              "data-[state=closed]:animate-[content-hide_300ms] data-[state=open]:animate-[content-show_300ms]",
              "fixed top-0 right-0 z-50 h-screen w-screen container bg-card-bg p-6 text-body focus:outline-none",
            )}
          >
            <div className="relative h-full w-full">
              <Dialog.Close asChild>
                <Button
                  theme="transparent"
                  className="absolute right-0 sm:-top-5 top-0 link:text-danger-bg text-danger-bg/50"
                >
                  <XIcon aria-hidden />
                </Button>
              </Dialog.Close>
              {props.children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    );
  }),
};
