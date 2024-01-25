import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";
import DefaultTheme from "~/styles/default.json";
import { createCssTheme } from "~/styles/setup";
import "~/styles/index.css";

const APP_NAME = "Racha aí";
const APP_DEFAULT_TITLE = "Racha aí";
const APP_TITLE_TEMPLATE = "%s - Racha aí";
const APP_DESCRIPTION = "O app pra você dividir a conta com a galera.";

export const generateViewport = (): Viewport => ({
  themeColor: "black",
  colorScheme: "normal",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
});

export const generateMetadata = (): Metadata => ({
  metadataBase: new URL("https://racha.ai"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
});

export default function RootLayout(props: PropsWithChildren<{}>) {
  const styles = createCssTheme(DefaultTheme);
  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" />
        <style id="theme" type="text/css">
          {styles}
        </style>
      </head>
      <body>
        <div id="root">{props.children}</div>
      </body>
    </html>
  );
}
