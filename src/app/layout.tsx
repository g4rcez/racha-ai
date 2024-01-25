import type { Viewport } from "next";
import { PropsWithChildren } from "react";
import DefaultTheme from "~/styles/default.json";
import { createCssTheme } from "~/styles/setup";
import "~/styles/index.css";

export const generateViewport = (): Viewport => ({
  themeColor: "black",
  colorScheme: "normal",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
});

export default function RootLayout(props: PropsWithChildren<{}>) {
  const styles = createCssTheme(DefaultTheme);
  return (
    <html lang="pt-br">
      <head>
        <title>Racha aí</title>
        <meta name="viewport" />
        <style global id="theme" type="text/css">
          {styles}
        </style>
      </head>
      <body>
        <div id="root">{props.children}</div>
      </body>
    </html>
  );
}
