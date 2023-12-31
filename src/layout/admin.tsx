import { Link, Outlet } from "brouther";
import { MenuIcon } from "lucide-react";
import { Fragment } from "react";
import { Shortcut, shortcuts } from "~/components/admin/shortcuts";
import { Button } from "~/components/button";
import { Drawer } from "~/components/drawer";
import { Logo } from "~/components/logo";
import { links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

export default function AdminLayout() {
    return (
        <Fragment>
            <Drawer>
                <header className="sticky top-0 z-10 mb-6 min-w-full bg-main-bg text-main shadow-lg">
                    <nav className="container mx-auto flex max-w-2xl items-center justify-between p-4">
                        <Link href={links.app}>
                            <Logo type="raw" />
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
                                        Todas as ações do nosso app estão aqui, bem fácil pra você acessar.
                                    </Drawer.Description>
                                </Drawer.Header>
                                <ul className="grid grid-cols-3 gap-4 py-4">
                                    {shortcuts.map((shortcut) => (
                                        <li key={`shortcut-menu-${shortcut.href}`}>
                                            <Shortcut {...shortcut} />
                                        </li>
                                    ))}
                                </ul>
                            </Drawer.Content>
                        </div>
                    </nav>
                </header>
                <Drawer.Trigger asChild>
                    <Button size="icon" rounded="circle" className="fixed dark:border-white border border-black bottom-5 right-5 p-2 text-2xl">
                        <MenuIcon absoluteStrokeWidth strokeWidth={2} size={32} />
                    </Button>
                </Drawer.Trigger>
            </Drawer>
            <div className="container mx-auto max-w-2xl px-4">
                <Outlet />
            </div>
        </Fragment>
    );
}
