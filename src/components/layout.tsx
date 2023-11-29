import { Link, Outlet, useHref, useRouteError } from "brouther";
import { useEffect } from "react";
import { links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

export const Layout = () => {
    const path = useHref();
    const [_error, page] = useRouteError();
    useEffect(() => {
        const data: any = page?.data ?? {};
        if (data.title) {
            document.title = data.title;
        }
    }, [page]);
    if (path === "/") return <Outlet />;
    if (path.startsWith("/app"))
        return (
            <div>
                <header className="sticky top-0 mb-6 min-w-full bg-main-bg text-main shadow-lg">
                    <nav className="flex items-center justify-between p-4">
                        <Link href={links.app}>
                            <h1 className="text-lg font-medium tracking-wide">Divide Aí</h1>
                        </Link>
                        <div>
                            <ThemeToggle />
                        </div>
                    </nav>
                </header>
                <div className="px-4">
                    <Outlet />
                </div>
            </div>
        );
    return <Outlet />;
};
