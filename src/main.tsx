import { Brouther, Outlet, useHref } from "brouther";
import React from "react";
import ReactDOM from "react-dom/client";
import { routerConfig } from "~/router";
import DefaultTheme from "~/styles/default.json";
import "~/styles/index.css";
import { setupTheme } from "~/styles/setup";

async function start() {
    const html = document.documentElement;
    const head = html.querySelector("head")!;
    setupTheme(head, DefaultTheme, DefaultTheme.name as any);
    return document.getElementById("root")!;
}

const Layout = () => {
    console.log(useHref());
    const path = useHref();
    if (path === "/") return <Outlet />;
    if (path.startsWith("/app"))
        return (
            <div>
                <Outlet />
            </div>
        );
    return <Outlet />;
};

start().then((root) => {
    requestIdleCallback(() =>
        React.startTransition(() =>
            ReactDOM.createRoot(root).render(
                <React.StrictMode>
                    <React.Suspense fallback={<div className="" />}>
                        <Brouther config={routerConfig}>
                            <Layout />
                        </Brouther>
                    </React.Suspense>
                </React.StrictMode>
            )
        )
    );
});
