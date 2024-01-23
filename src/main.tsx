import { Brouther } from "brouther";
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { Layout } from "~/layout/layout";
import { setupObservability } from "~/lib/observability";
import { routerConfig } from "~/router";
import { ColorThemes, Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";
import "~/styles/index.css";
import { setupTheme } from "~/styles/setup";
import { AppBoundary } from "./components/error";

const updateSW = registerSW({
  onOfflineReady() {},
  onNeedRefresh() {
    return updateSW(true);
    // if (confirm(i18n.get("hasUpdate"))) return updateSW(true);
  },
});

async function start() {
  setupObservability();
  const html = document.documentElement;
  const head = html.querySelector("head")!;
  setupTheme(head, DefaultTheme, DefaultTheme.name as ColorThemes);
  const initialPreferences = Preferences.initialState();
  Preferences.setup(initialPreferences);
  return document.getElementById("root")!;
}

const idleCallback = window.requestIdleCallback ?? ((fn: Function) => fn());

start().then((root) => {
  idleCallback(() =>
    React.startTransition(() =>
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <AppBoundary>
            <React.Suspense fallback={<div className="" />}>
              <Brouther config={routerConfig}>
                <Layout />
              </Brouther>
            </React.Suspense>
          </AppBoundary>
        </React.StrictMode>,
      ),
    ),
  );
});
