import { Link, Outlet, useRouteError } from "brouther";
import { MenuIcon } from "lucide-react";
import { Fragment, useState } from "react";
import {
  isShortcutLink,
  Shortcut,
  getMenuShortcuts,
} from "~/components/admin/shortcuts";
import { Button } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Logo } from "~/components/logo";
import { links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

export default function AdminLayout() {
  const [_, p] = useRouteError();
  const title = (p?.data as any)?.name || null;
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return (
    <Fragment>
      <Drawer onChange={setOpen} open={open}>
        <header className="sticky top-0 z-10 mb-6 min-w-full bg-main-bg text-main shadow-lg">
          <nav className="container mx-auto flex max-w-2xl items-center justify-between p-4">
            <Link href={links.app}>
              {title ? (
                <span className="text-2xl font-bold">{title}</span>
              ) : (
                <Logo type="raw" />
              )}
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Drawer.Trigger asChild>
                <button>
                  <MenuIcon />
                </button>
              </Drawer.Trigger>
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
            </div>
          </nav>
        </header>
        <Drawer.Trigger asChild>
          <Button
            size="icon"
            rounded="circle"
            className="fixed bottom-5 right-5 border border-black p-2 text-2xl dark:border-white"
          >
            <MenuIcon absoluteStrokeWidth strokeWidth={2} size={32} />
          </Button>
        </Drawer.Trigger>
      </Drawer>
      <div className="container mx-auto max-w-2xl px-4 pb-24">
        <Outlet />
      </div>
    </Fragment>
  );
}
