import { Brouther } from "brouther";
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { Layout } from "~/components/layout";
import { routerConfig } from "~/router";
import { Preferences } from "~/store/preferences.store";
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
    const initialPreferences = Preferences.initialState();
    Preferences.setup(initialPreferences);
    return document.getElementById("root")!;
}

const idleCallback = window.requestIdleCallback ?? ((fn: Function) => fn());

console.log(idleCallback);

start().then((root) => {
    idleCallback(() =>
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
