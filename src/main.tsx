import * as Sentry from "@sentry/react";
import { Brouther } from "brouther";
import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { i18n } from "~/i18n";
import { Layout } from "~/layout/layout";
import { routerConfig } from "~/router";
import { ColorThemes, Preferences } from "~/store/preferences.store";
import DefaultTheme from "~/styles/default.json";
import "~/styles/index.css";
import { setupTheme } from "~/styles/setup";
import { AppBoundary } from "./components/error";

Sentry.init({
  dsn: "https://ed33c0df3b0e3fdb887bdae52c0f2d98@o4505117532684288.ingest.sentry.io/4506617828671488",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/racha\.ai/],
    }),
    new Sentry.Replay({ maskAllText: false, blockAllMedia: false }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const updateSW = registerSW({
  onOfflineReady() {},
  onNeedRefresh() {
    if (confirm(i18n.get("hasUpdate"))) return updateSW(true);
  },
});

async function start() {
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
