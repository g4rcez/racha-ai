import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: { https: {} },
  resolve: { alias: { "~": path.resolve(__dirname, "./src/") } },
  build: {
    cssMinify: "lightningcss",
    manifest: true,
    minify: "terser",
    sourcemap: false,
  },
  plugins: [
    mkcert(),
    react(),
    VitePWA({
      includeAssets: ["**/*"],
      workbox: { globIgnores: ["/blog/**", "/blog", "/changelog"] },
      manifest: {
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        scope: "/app",
        start_url: "/app",
        short_name: "Racha aí",
        description: "Racha aí",
        name: "Racha aí",
        icons: [
          { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
          { src: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
});
