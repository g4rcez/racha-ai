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
        <style key="theme" id="base-theme" type="text/css">
          {createCssTheme(DefaultTheme)}
        </style>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </Fragment>
  );
}
