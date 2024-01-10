import * as Dialog from "@radix-ui/react-dialog";
import { XCircleIcon } from "lucide-react";
import { PropsWithChildren } from "react";
import { Title } from "~/components/typography";
import { useTranslations } from "~/i18n";
import { Label } from "~/types";

type Props = {
  trigger: Label;
  title: string;
  description?: Label;
  visible?: boolean;
  onChange?: (visible: boolean) => void;
};

export const Modal = (props: PropsWithChildren<Props>) => {
  const i18n = useTranslations();
  return (
    <Dialog.Root modal open={props.visible} onOpenChange={props.onChange}>
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal forceMount={props.visible || undefined}>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-overlayShow" />
        <Dialog.Content
          onInteractOutside={() => props.onChange?.(false)}
          className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-body-bg px-6 py-8 shadow-2xl focus:outline-none data-[state=open]:animate-contentShow overflow-y-auto"
        >
          <Dialog.Title asChild>
            <Title>{props.title}</Title>
          </Dialog.Title>
          {props.description ? (
            <Dialog.Description className="text-mauve11 mb-5 mt-[10px] leading-normal">
              {props.description}
            </Dialog.Description>
          ) : null}
          {props.children}
          <Dialog.Close asChild>
            <button
              aria-label={i18n.get("closeModal", props)}
              className="absolute right-3 top-3 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full text-body transition-colors duration-300 focus:outline-none link:bg-danger-bg link:bg-opacity-40"
            >
              <XCircleIcon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
