import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import PackageJson from "./package.json";

const version = `${PackageJson.version}`;

export default defineConfig({
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src/")
        }
    },
    build: {
        cssMinify: "lightningcss",
        manifest: true,
        minify: "terser",
        sourcemap: false,
        rollupOptions: {
            output: {
                assetFileNames: `${version}/assets/[name][extname]`,
                chunkFileNames: (a) => (a.name.endsWith(".js") ? `${version}/${a.name}` : `${version}/[name].js`),
                entryFileNames: (a) => (a.name.endsWith(".js") ? `${version}/${a.name}` : `${version}/[name].js`),
                sourcemap: false,
                strict: true
            }
        }
    },
    plugins: [
        react(),
        VitePWA({
            workbox: {
                globPatterns: ["**/*"],
                globIgnores: ["/blog/**", "/blog", "/changelog"]
            },
            includeAssets: ["**/*"],
            manifest: {
                theme_color: "#f69435",
                background_color: "#f69435",
                display: "standalone",
                scope: "/",
                start_url: "/",
                short_name: "Divide Aí",
                description: "O app pra dividir a conta com a galera",
                name: "divide-ai",
                icons: [
                    {
                        src: "/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "/icon-256x256.png",
                        sizes: "256x256",
                        type: "image/png"
                    },
                    {
                        src: "/icon-384x384.png",
                        sizes: "384x384",
                        type: "image/png"
                    },
                    {
                        src: "/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ]
            }
        })
    ]
});
