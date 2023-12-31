import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import React, { ComponentProps, PropsWithChildren } from "react";
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

const desktopProps = {
    exit: { opacity: 0.8, width: 0 },
    initial: { opacity: 0.6, width: 0 },
    animate: { opacity: 1, width: "100%" },
    transition: { ease: "easeOut", duration: 0.3 }
};

const mobileProps = {
    exit: { opacity: 0.8, height: 0 },
    initial: { opacity: 0.6, height: 0 },
    animate: { opacity: 1, height: "100%" },
    transition: { ease: "easeOut", duration: 0.3 }
};

Drawer.Content = React.forwardRef((props: Dialog.DialogContentProps, ref: any) => {
    const f = Mobile.use() ? mobileProps : desktopProps;
    return (
        <Dialog.Portal>
            <Dialog.Overlay asChild>
                <motion.div layout className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-overlayShow" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
                <motion.div
                    layout
                    ref={ref}
                    exit={f.exit}
                    animate={f.animate}
                    initial={f.initial}
                    transition={f.transition}
                    className={css(
                        Mobile.use()
                            ? "fixed bottom-0 z-50 h-screen max-h-[90vh] w-screen bg-body-bg p-6 text-body focus:outline-none"
                            : "container fixed right-0 top-0 z-50 h-screen w-[90vw] max-w-[40rem] rounded-l-md bg-body-bg p-6 text-body focus:outline-none"
                    )}
                >
                    <div className="relative h-full w-full">
                        <Mobile>
                            <div aria-hidden className="container mx-auto mb-4 h-2 w-1/2 rounded bg-muted lg:hidden"/>
                        </Mobile>
                        {props.children}
                    </div>
                </motion.div>
            </Dialog.Content>
        </Dialog.Portal>
    );
});

Drawer.Header = React.forwardRef((props: ComponentProps<"div">, ref: any) => <header {...props} ref={ref} />);

Drawer.Title = React.forwardRef((props: ComponentProps<"h1">, ref: any) => <Title {...(props as any)} ref={ref} />);

Drawer.Description = React.forwardRef((props: ComponentProps<"p">, ref: any) => <p {...props} ref={ref} />);

Drawer.Close = React.forwardRef((props, ref: any) => <Dialog.Close {...props} ref={ref} />);
