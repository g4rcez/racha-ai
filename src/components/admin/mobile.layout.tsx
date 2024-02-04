import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, PropsWithChildren, useState } from "react";
import {
  getActionBarShortcuts,
  getMenuShortcuts,
  isMenuAction,
  isShortcutLink,
  Shortcut,
} from "~/components/admin/shortcuts";
import { Drawer } from "~/components/drawer";
import { Logo } from "~/components/logo";
import { css } from "~/lib/dom";
import { Links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

const commonBarCss = "fixed z-10 w-screen bg-body-bg text-body bg-body-nav";

export const MobileLayout = (props: PropsWithChildren) => {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const title = "Racha aí";
  return (
    <Fragment>
      <div className="flex flex-col w-full pb-32 text-body bg-body-bg">
        <header className={css(commonBarCss, "top-0 shadow py-4")}>
          <nav className="flex container mx-auto flex-row px-4 flex-nowrap gap-4 justify-between">
            <Link href={Links.app}>
              {title ? (
                <span className="text-2xl font-bold">{title}</span>
              ) : (
                <Logo type="raw" />
              )}
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={toggle}>
                <MenuIcon />
              </button>
            </div>
          </nav>
        </header>
        <div className="flex-1 mx-auto container w-full flex flex-col px-4 pt-20">
          {props.children}
        </div>
        <footer
          className={css(commonBarCss, "bottom-0 py-2 pb-6 shadow w-full")}
        >
          <nav className="gap-4 grid grid-cols-5 container mx-auto">
            {getActionBarShortcuts().map((x, i) => {
              if (isMenuAction(x)) {
                return (
                  <button
                    key={`action-button-${i}`}
                    onClick={() => x.action({ open: () => setOpen(true) })}
                    className={css(
                      "flex flex-col gap-2 text-xs items-center justify-center w-full",
                      x.className,
                    )}
                  >
                    <x.icon absoluteStrokeWidth strokeWidth={2} size={20} />
                    <span>{x.text}</span>
                  </button>
                );
              }
              const matches = x.href === path;
              return (
                <Link
                  href={x.href as any}
                  key={`links-${x.title}-${i}`}
                  data-active={matches}
                  className="data-[active=true]:text-main-bg data-[active=true]:font-bold flex flex-col gap-2 text-xs items-center justify-center w-full"
                >
                  <x.icon
                    absoluteStrokeWidth
                    strokeWidth={matches ? 2 : 1}
                    size={20}
                  />
                  <span>{x.title}</span>
                </Link>
              );
            })}
          </nav>
        </footer>
      </div>
      <Drawer onChange={setOpen} open={open}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Menu</Drawer.Title>
            <Drawer.Description>
              Todas as ações do nosso app estão aqui, bem fácil pra você
              acessar.
            </Drawer.Description>
          </Drawer.Header>
          <ul className="mt-4 grid w-full grid-cols-2 lg:grid-cols-3 gap-8">
            {getMenuShortcuts().map((shortcut, index) =>
              isShortcutLink(shortcut) ? (
                <li key={`shortcut-${shortcut.href}`}>
                  <Shortcut {...shortcut} onClick={toggle} />
                </li>
              ) : (
                <li key={`shortcut-${index}-drawer`}>
                  <Shortcut {...shortcut} />
                </li>
              ),
            )}
          </ul>
        </Drawer.Content>
      </Drawer>
    </Fragment>
  );
};
