import { Link, Outlet, useHref, useRouteError } from "brouther";
import {Fragment, useEffect} from "react";
import { Logo } from "~/components/logo";
import { links } from "~/router";
import { ThemeToggle } from "~/store/preferences.store";

const App = () => {
    return (
        <Fragment>
            <header className="sticky top-0 mb-6 min-w-full bg-main-bg text-main shadow-lg z-10">
                <nav className="container mx-auto flex max-w-2xl items-center justify-between p-4">
                    <Link href={links.app}>
                        <Logo type="raw" />
                    </Link>
                    <div>
                        <ThemeToggle />
                    </div>
                </nav>
            </header>
            <div className="container mx-auto max-w-2xl px-4">
                <Outlet />
            </div>
        </Fragment>
    );
};

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
    if (path.startsWith("/app")) return <App />;
    return <Outlet />;
};
