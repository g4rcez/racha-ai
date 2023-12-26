import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingPortal,
    offset,
    Placement,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useMergeRefs,
    useRole,
} from "@floating-ui/react";
import * as React from "react";
import { css } from "~/lib/dom";

interface PopoverOptions {
    initialOpen?: boolean;
    placement?: Placement;
    modal?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function usePopover({
    initialOpen = false,
    placement = "bottom",
    modal,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: PopoverOptions = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const [labelId, setLabelId] = React.useState<string | undefined>();
    const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "end",
                padding: 5,
            }),
            shift({ padding: 5 }),
        ],
    });

    const context = data.context;

    const click = useClick(context, {
        enabled: controlledOpen == null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return React.useMemo(
        () => ({
            open,
            setOpen,
            ...interactions,
            ...data,
            modal,
            labelId,
            descriptionId,
            setLabelId,
            setDescriptionId,
        }),
        [open, setOpen, interactions, data, modal, labelId, descriptionId],
    );
}

type ContextType =
    | (ReturnType<typeof usePopover> & {
          setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
          setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
      })
    | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
    const context = React.useContext(PopoverContext);
    if (context == null) {
        throw new Error("Popover components must be wrapped in <Popover />");
    }
    return context;
};

export function Popover({ children, modal = false, ...restOptions }: { children: React.ReactNode } & PopoverOptions) {
    const popover = usePopover({ modal, ...restOptions });
    return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

export const PopoverTrigger = React.forwardRef<HTMLElement, React.ComponentProps<"button">>(function PopoverTrigger(
    { children, ...props },
    propRef,
) {
    const context = usePopoverContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
    return (
        <button
            ref={ref}
            type="button"
            data-state={context.open ? "open" : "closed"}
            {...context.getReferenceProps(props)}
        >
            {children}
        </button>
    );
});

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function PopoverContent(
    { style, ...props },
    propRef,
) {
    const { context: floatingContext, ...rest } = usePopoverContext();
    const ref = useMergeRefs([rest.refs.setFloating, propRef]);

    if (!floatingContext.open) return null;

    return (
        <FloatingPortal>
            <FloatingFocusManager context={floatingContext} modal={rest.modal}>
                <div
                    {...rest.getFloatingProps(props)}
                    ref={ref}
                    style={{ ...rest.floatingStyles, ...style }}
                    aria-labelledby={rest.labelId}
                    aria-describedby={rest.descriptionId}
                    className={css(props.className, "rounded-md border bg-body-bg p-3")}
                >
                    {props.children}
                </div>
            </FloatingFocusManager>
        </FloatingPortal>
    );
});

export const PopoverHeading = React.forwardRef<HTMLHeadingElement, React.HTMLProps<HTMLHeadingElement>>(
    function PopoverHeading(props, ref) {
        const { setLabelId } = usePopoverContext();
        const id = useId();

        // Only sets `aria-labelledby` on the Popover root element
        // if this component is mounted inside it.
        React.useLayoutEffect(() => {
            setLabelId(id);
            return () => setLabelId(undefined);
        }, [id, setLabelId]);

        return (
            <h2 {...props} ref={ref} id={id}>
                {props.children}
            </h2>
        );
    },
);

export const PopoverDescription = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    function PopoverDescription(props, ref) {
        const { setDescriptionId } = usePopoverContext();
        const id = useId();
        React.useLayoutEffect(() => {
            setDescriptionId(id);
            return () => setDescriptionId(undefined);
        }, [id, setDescriptionId]);
        return <div {...props} ref={ref} id={id} />;
    },
);

export const PopoverClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    function PopoverClose(props, ref) {
        const { setOpen } = usePopoverContext();
        return (
            <button
                type="button"
                ref={ref}
                {...props}
                onClick={(event) => {
                    props.onClick?.(event);
                    setOpen(false);
                }}
            />
        );
    },
);
