import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, PropsWithChildren, useState } from "react";
import { Drawer, Logo } from "~/components";
import { getActionBarShortcuts, getMenuShortcuts, isMenuAction, isShortcutLink, Shortcut } from "~/components/admin/shortcuts";
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
            <div className="grid grid-cols-1 bg-body-bg pb-32 text-body">
                <header className={css(commonBarCss, "top-0 py-4 shadow")}>
                    <nav className="container mx-auto flex flex-row flex-nowrap justify-between gap-4 px-4">
                        <Link href={Links.app}>{title ? <span className="text-2xl font-bold">{title}</span> : <Logo type="raw" />}</Link>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button onClick={toggle}>
                                <MenuIcon />
                            </button>
                        </div>
                    </nav>
                </header>
                <div className="container mx-auto flex w-full flex-1 flex-col px-4 pt-20">{props.children}</div>
                <footer className={css(commonBarCss, "bottom-0 w-full py-2 pb-6 shadow")}>
                    <nav className="container mx-auto grid grid-cols-5 gap-4">
                        {getActionBarShortcuts().map((x, i) => {
                            if (isMenuAction(x)) {
                                return (
                                    <button
                                        key={`action-button-${i}`}
                                        onClick={() => x.action({ open: () => setOpen(true) })}
                                        className={css("flex w-full flex-col items-center justify-center gap-2 text-xs", x.className)}
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
                                    className="flex w-full flex-col items-center justify-center gap-2 text-xs data-[active=true]:font-bold data-[active=true]:text-main-bg"
                                >
                                    <x.icon absoluteStrokeWidth strokeWidth={matches ? 2 : 1} size={20} />
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
                        <Drawer.Description>Todas as ações do nosso app estão aqui, bem fácil pra você acessar.</Drawer.Description>
                    </Drawer.Header>
                    <ul className="mt-4 grid w-full grid-cols-2 gap-8 lg:grid-cols-3">
                        {getMenuShortcuts().map((shortcut, index) =>
                            isShortcutLink(shortcut) ? (
                                <li key={`shortcut-${shortcut.href}`}>
                                    <Shortcut {...shortcut} onClick={toggle} />
                                </li>
                            ) : (
                                <li key={`shortcut-${index}-drawer`}>
                                    <Shortcut {...shortcut} />
                                </li>
                            )
                        )}
                    </ul>
                </Drawer.Content>
            </Drawer>
        </Fragment>
    );
};
