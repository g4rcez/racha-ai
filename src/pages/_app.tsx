import Head from "next/head";
import { Fragment } from "react";
import DefaultTheme from "~/styles/default.json";
import { createCssTheme } from "~/styles/setup";
import "~/styles/index.css";
import { AppPropsWithLayout } from "~/types";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
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
        <meta name="mobile-web-app-capable" content="yes" />
        <style key="theme" id="base-theme" type="text/css">
          {createCssTheme(DefaultTheme)}
        </style>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </Fragment>
  );
}
