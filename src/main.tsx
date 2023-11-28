import { Brouther } from "brouther";
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { Layout } from "~/components/layout";
import { Preferences } from "~/models/preferences";
import { routerConfig } from "~/router";
import { initialPreferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";
import "~/styles/index.css";
import { setupTheme } from "~/styles/setup";

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New content available. Reload?")) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log("offline ready");
    }
});

async function start() {
    const html = document.documentElement;
    const head = html.querySelector("head")!;
    setupTheme(head, DefaultTheme, DefaultTheme.name as any);
    Preferences.setup(initialPreferences);
    return document.getElementById("root")!;
}

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
