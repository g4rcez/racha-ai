import * as Dialog from "@radix-ui/react-dialog";
import { DialogCloseProps } from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React, { ComponentProps, PropsWithChildren } from "react";
import { Button } from "~/components/button";
import { Mobile } from "~/components/mobile";
import { Title } from "~/components/typography";
import { css } from "~/lib/dom";

export const Drawer = (props: PropsWithChildren<Partial<{ open: boolean; onChange: (b: boolean) => void }>>) => (
    <Dialog.Root {...props} modal open={props.open} onOpenChange={props.onChange}>
        {props.children}
    </Dialog.Root>
);

Drawer.Trigger = React.forwardRef((props: Dialog.DialogTriggerProps, ref: any) => (
    <Dialog.Trigger {...props} ref={ref} />
));

Drawer.Content = React.forwardRef((props: Dialog.DialogContentProps, ref: any) => {
    return (
        <Dialog.Portal>
            <Dialog.Overlay asChild>
                <div className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-[overlay-hide_300ms] data-[state=open]:animate-[overlay-show_300ms]" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
                <div
                    ref={ref}
                    className={css(
                        "origin-bottom lg:origin-right overflow-y-auto",
                        "data-[state=closed]:animate-[content-hide_300ms] data-[state=open]:animate-[content-show_300ms]",
                        Mobile.use()
                            ? "fixed bottom-0 z-50 h-screen max-h-[80vh] w-screen bg-body-bg p-6 text-body focus:outline-none"
                            : "container fixed right-0 top-0 z-50 h-screen w-[90vw] max-w-[40rem] rounded-l-md bg-body-bg p-6 text-body focus:outline-none"
                    )}
                >
                    <div className="relative h-full w-full">
                        <Dialog.Close asChild>
                            <Button theme="transparent" className="absolute right-0 lg:-top-5 top-0 link:text-danger-bg text-danger-bg/50">
                                <XIcon aria-hidden />
                            </Button>
                        </Dialog.Close>
                        {props.children}
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    );
});

Drawer.Header = React.forwardRef((props: ComponentProps<"div">, ref: any) => <header {...props} ref={ref} />);

Drawer.Title = React.forwardRef((props: ComponentProps<"h1">, ref: any) => <Title {...(props as any)} ref={ref} />);

Drawer.Description = React.forwardRef((props: ComponentProps<"p">, ref: any) => <p {...props} ref={ref} />);

Drawer.Close = React.forwardRef((props: DialogCloseProps, ref: any) => <Dialog.Close {...props} ref={ref} />);
