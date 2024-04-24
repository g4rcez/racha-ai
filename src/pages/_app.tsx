import Head from "next/head";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Fragment, ReactElement } from "react";
import DefaultTheme from "~/styles/default.json";
import { createCssTheme } from "~/styles/setup";
import "~/styles/index.css";
import { AppPropsWithLayout } from "~/types";

if (typeof window !== "undefined") {
    // checks that we are client-side
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
        }
    });
}

const staticLayout = (page: ReactElement) => page;

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? staticLayout;
    return (
        <Fragment>
            <Head>
                <title>Racha aí</title>
                <meta name="application-name" content="Racha aí" />
                <meta name="apple-mobile-web-app-title" content="Racha aí" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <style key="theme" id="base-theme" type="text/css">
                    {createCssTheme(DefaultTheme)}
                </style>
            </Head>
            {getLayout(<Component {...pageProps} />, session)}
        </Fragment>
    );
}

export default function AppRoot(props: AppPropsWithLayout) {
    return (
        <PostHogProvider client={posthog}>
            <App {...props} />
        </PostHogProvider>
    );
}
