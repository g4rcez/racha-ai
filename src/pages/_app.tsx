import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { Fragment, ReactElement } from "react";
import DefaultTheme from "~/styles/default.json";
import { createCssTheme } from "~/styles/setup";
import "~/styles/index.css";
import { AppPropsWithLayout } from "~/types";

const staticLayout = (page: ReactElement) => page;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? staticLayout;
  console.log("_app.tsx", session);
  return (
    <Fragment>
      <Head>
        <title>Racha aí</title>
        <meta name="application-name" content="Racha aí" />
        <meta name="apple-mobile-web-app-title" content="Racha aí" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style key="theme" id="base-theme" type="text/css">
          {createCssTheme(DefaultTheme)}
        </style>
      </Head>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />, session)}
      </SessionProvider>
    </Fragment>
  );
}
