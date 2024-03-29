import { clsx } from "clsx";
import type React from "react";
import { createContext, useContext, useState } from "react";

const TableContext = createContext<{
  bleed: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
});

type TableProps = {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
};

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: TableProps & React.ComponentPropsWithoutRef<"div">) {
  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root w-full">
        <div
          {...props}
          className={clsx(
            className,
            "-mx-[--gutter] overflow-x-auto whitespace-nowrap",
          )}
        >
          <div
            className={clsx(
              "inline-block min-w-full align-middle",
              !bleed && "sm:px-[--gutter]",
            )}
          >
            <table className="min-w-full text-left text-sm/6">{children}</table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export const TableHead = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) => (
  <thead
    className={clsx(className, "text-zinc-500 dark:text-zinc-400")}
    {...props}
  />
);

export const TableBody = (props: React.ComponentPropsWithoutRef<"tbody">) => (
  <tbody {...props} />
);

const TableRowContext = createContext<{
  href?: string;
  target?: string;
  title?: string;
}>({
  href: undefined,
  target: undefined,
  title: undefined,
});

export const TableRow = ({
  href,
  target,
  title,
  className,
  children,
  ...props
}: {
  href?: string;
  target?: string;
  title?: string;
} & React.ComponentPropsWithoutRef<"tr">) => {
  const { striped } = useContext(TableContext);
  return (
    <TableRowContext.Provider
      value={
        { href, target, title } as React.ContextType<typeof TableRowContext>
      }
    >
      <tr
        {...props}
        className={clsx(
          className,
          href &&
            "has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]",
          striped && "even:bg-zinc-950/[2.5%] dark:even:bg-white/[2.5%]",
          href && striped && "hover:bg-zinc-950/5 dark:hover:bg-white/5",
          href &&
            !striped &&
            "hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]",
        )}
      >
        {children}
      </tr>
    </TableRowContext.Provider>
  );
};

export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  const { bleed, grid } = useContext(TableContext);

  return (
    <th
      {...props}
      className={clsx(
        className,
        "border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10",
        grid &&
          "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        !bleed && "sm:first:pl-2 sm:last:pr-2",
      )}
    />
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  const { bleed, dense, grid, striped } = useContext(TableContext);
  const { href } = useContext(TableRowContext);
  const [_, setCellRef] = useState<HTMLElement | null>(null);

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      className={clsx(
        className,
        "relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        !striped && "border-b border-zinc-950/5 dark:border-white/5",
        grid &&
          "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-2 sm:last:pr-2",
      )}
    >
      {children}
    </td>
  );
}
