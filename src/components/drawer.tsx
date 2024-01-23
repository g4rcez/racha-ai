import * as Dialog from "@radix-ui/react-dialog";
import { DialogCloseProps } from "@radix-ui/react-dialog";
import React, { ComponentProps, PropsWithChildren } from "react";
import { DesktopDrawer } from "~/components/drawer/desktop";
import { Platform } from "~/components/platform";
import { MobileDrawer } from "./drawer/mobile";

type DrawerProps = PropsWithChildren<
  Partial<{ open: boolean; onChange: (b: boolean) => void }>
>;

type Drawer = ((props: DrawerProps) => React.ReactElement) & {
  Root: Component<Dialog.DialogTriggerProps>;
  Trigger: Component<Dialog.DialogTriggerProps>;
  Header: Component<ComponentProps<"div">>;
  Content: Component<Dialog.DialogContentProps & Dialog.DialogOverlayProps>;
  Title: Component<ComponentProps<"h1">>;
  Description: Component<ComponentProps<"p">>;
  Close: Component<DialogCloseProps>;
};

export const Drawer: Drawer = ((props: DrawerProps) => {
  const mobile = Platform.use();
  if (mobile) return <MobileDrawer.Root {...props} />;
  return <DesktopDrawer.Root {...props} />;
}) as any;

type Component<P> = (props: P) => React.ReactElement;

const appendToDrawer = <P extends object = object>(
  key: keyof typeof MobileDrawer,
) => {
  (Drawer as any)[key] = React.forwardRef((props: P, ref: any) => {
    const mobile = Platform.use();
    const Component: any = mobile ? MobileDrawer[key] : DesktopDrawer[key];
    return <Component {...props} ref={ref} />;
  });
};

appendToDrawer<Dialog.DialogTriggerProps>("Trigger");
appendToDrawer<ComponentProps<"div">>("Header");
appendToDrawer<Dialog.DialogContentProps>("Content");
appendToDrawer<ComponentProps<"h1">>("Title");
appendToDrawer<ComponentProps<"p">>("Description");
appendToDrawer<DialogCloseProps>("Close");
