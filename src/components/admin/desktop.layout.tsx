import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Fragment, PropsWithChildren, useState } from "react";
import {
  getMenuShortcuts,
  isShortcutLink,
  Shortcut,
} from "~/components/admin/shortcuts";
import { Drawer } from "~/components/drawer";
import { Logo } from "~/components/logo";
import { Links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

export const DesktopLayout = (props: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  const title = "Racha aí";
  return (
    <Fragment>
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
      <header className="sticky top-0 left-0 h-20 z-10 min-w-full bg-main-bg text-main flex items-center shadow-lg">
        <nav className="container mx-auto flex px-4 max-w-2xl items-center justify-between">
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
      <div className="container pt-10 mx-auto max-w-2xl px-4 pb-16 text-body bg-body-bg">
        {props.children}
      </div>
    </Fragment>
  );
};
