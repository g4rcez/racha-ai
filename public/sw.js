if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + ".js", c).href),
    s[a] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, n) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const d = (e) => a(e, t),
      r = { module: { uri: t }, exports: i, require: d };
    s[t] = Promise.all(c.map((e) => r[e] || d(e))).then((e) => (n(...e), i));
  };
}
define(["./workbox-2e6be583"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/109.9803a3ddb9d4a0b2.js",
          revision: "9803a3ddb9d4a0b2",
        },
        {
          url: "/_next/static/chunks/109.9803a3ddb9d4a0b2.js.map",
          revision: "8f0c68089791cd55db018c9802a59ce0",
        },
        {
          url: "/_next/static/chunks/181-2f9c8869e06d37e3.js",
          revision: "2f9c8869e06d37e3",
        },
        {
          url: "/_next/static/chunks/181-2f9c8869e06d37e3.js.map",
          revision: "10ab8116b81c28cf00beb50a73871386",
        },
        {
          url: "/_next/static/chunks/185.71d648366ac52575.js",
          revision: "71d648366ac52575",
        },
        {
          url: "/_next/static/chunks/185.71d648366ac52575.js.map",
          revision: "d398e36180653a399d00a9d8b050ac97",
        },
        {
          url: "/_next/static/chunks/320.2d289a564b61c68e.js",
          revision: "2d289a564b61c68e",
        },
        {
          url: "/_next/static/chunks/320.2d289a564b61c68e.js.map",
          revision: "c0fb05e128ecaff919823fe5c38a8023",
        },
        {
          url: "/_next/static/chunks/377.d546db85b404d6be.js",
          revision: "d546db85b404d6be",
        },
        {
          url: "/_next/static/chunks/377.d546db85b404d6be.js.map",
          revision: "a295fd792d9f85ebd589d4b5ed02822c",
        },
        {
          url: "/_next/static/chunks/553-5055854ed2462ab3.js",
          revision: "5055854ed2462ab3",
        },
        {
          url: "/_next/static/chunks/553-5055854ed2462ab3.js.map",
          revision: "9481351ffec56de3859c403c2cdd4a41",
        },
        {
          url: "/_next/static/chunks/577-817d5124a04fdf66.js",
          revision: "817d5124a04fdf66",
        },
        {
          url: "/_next/static/chunks/577-817d5124a04fdf66.js.map",
          revision: "0a40a1ec14a0b473452d0d23ca5a7d85",
        },
        {
          url: "/_next/static/chunks/598-0961215b44422420.js",
          revision: "0961215b44422420",
        },
        {
          url: "/_next/static/chunks/598-0961215b44422420.js.map",
          revision: "4cb7fc7644b1824fb36dfdb16592fde6",
        },
        {
          url: "/_next/static/chunks/610-83c07c26d132dbbf.js",
          revision: "83c07c26d132dbbf",
        },
        {
          url: "/_next/static/chunks/610-83c07c26d132dbbf.js.map",
          revision: "b57adc624c70d2b286153f3b9e32295b",
        },
        {
          url: "/_next/static/chunks/742.1b8d442184643e3a.js",
          revision: "1b8d442184643e3a",
        },
        {
          url: "/_next/static/chunks/742.1b8d442184643e3a.js.map",
          revision: "3eb5c13267df5e15c2187f0602128846",
        },
        {
          url: "/_next/static/chunks/754-80f16e296e00747d.js",
          revision: "80f16e296e00747d",
        },
        {
          url: "/_next/static/chunks/754-80f16e296e00747d.js.map",
          revision: "4800251374806dd9bbc98fe1fe0fab61",
        },
        {
          url: "/_next/static/chunks/862-b3380aead65b91b8.js",
          revision: "b3380aead65b91b8",
        },
        {
          url: "/_next/static/chunks/862-b3380aead65b91b8.js.map",
          revision: "6092d771057949286c9275131015dba0",
        },
        {
          url: "/_next/static/chunks/890-269dd435f5105e8f.js",
          revision: "269dd435f5105e8f",
        },
        {
          url: "/_next/static/chunks/890-269dd435f5105e8f.js.map",
          revision: "dfab91adec2e11b17c8c984f279989f6",
        },
        {
          url: "/_next/static/chunks/938-3b10de0706777bd5.js",
          revision: "3b10de0706777bd5",
        },
        {
          url: "/_next/static/chunks/938-3b10de0706777bd5.js.map",
          revision: "b9f2d6757842ecfeeebb9f52612e72c3",
        },
        {
          url: "/_next/static/chunks/framework-fda0a023b274c574.js",
          revision: "fda0a023b274c574",
        },
        {
          url: "/_next/static/chunks/framework-fda0a023b274c574.js.map",
          revision: "ef3bd0b52e2272b847083ba02df20f61",
        },
        {
          url: "/_next/static/chunks/main-a0ebc454dc06fbb2.js",
          revision: "a0ebc454dc06fbb2",
        },
        {
          url: "/_next/static/chunks/main-a0ebc454dc06fbb2.js.map",
          revision: "9ca7f2c06ac8c0f6c1926535ff6c2752",
        },
        {
          url: "/_next/static/chunks/pages/_app-361c0894e510c57d.js",
          revision: "361c0894e510c57d",
        },
        {
          url: "/_next/static/chunks/pages/_app-361c0894e510c57d.js.map",
          revision: "80cd38d1d2c73eee9d13226a8f46eb9d",
        },
        {
          url: "/_next/static/chunks/pages/_error-7b3af279a8dc815e.js",
          revision: "7b3af279a8dc815e",
        },
        {
          url: "/_next/static/chunks/pages/_error-7b3af279a8dc815e.js.map",
          revision: "53f0fd767d8a8539068db1459a75b588",
        },
        {
          url: "/_next/static/chunks/pages/app-4d8e79be8c07717b.js",
          revision: "4d8e79be8c07717b",
        },
        {
          url: "/_next/static/chunks/pages/app-4d8e79be8c07717b.js.map",
          revision: "712d582a3f93751cb70ae0ed65671cb0",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-2e3e5e070d26397a.js",
          revision: "2e3e5e070d26397a",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-2e3e5e070d26397a.js.map",
          revision: "97b15cfa660446534ab08803333db1b0",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-f365e6d4196776a3.js",
          revision: "f365e6d4196776a3",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-f365e6d4196776a3.js.map",
          revision: "4fb3706c0fe2aad0ed8758631718d430",
        },
        {
          url: "/_next/static/chunks/pages/app/config-8f20c3ff59cf29fc.js",
          revision: "8f20c3ff59cf29fc",
        },
        {
          url: "/_next/static/chunks/pages/app/config-8f20c3ff59cf29fc.js.map",
          revision: "4e40054e3fcb41e02b0d842dc4d7d2b6",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-65b386b6956def61.js",
          revision: "65b386b6956def61",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-65b386b6956def61.js.map",
          revision: "2c7433837fd93d77520595cf341600d5",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-563aadb76ddf0f91.js",
          revision: "563aadb76ddf0f91",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-563aadb76ddf0f91.js.map",
          revision: "d0fec55e11d7d868bf1df5ec53548408",
        },
        {
          url: "/_next/static/chunks/pages/global-error-9ca6e4ebb562b0e4.js",
          revision: "9ca6e4ebb562b0e4",
        },
        {
          url: "/_next/static/chunks/pages/global-error-9ca6e4ebb562b0e4.js.map",
          revision: "3144d41e1f52ec58b83966507144a690",
        },
        {
          url: "/_next/static/chunks/pages/index-958574da26e6b6e0.js",
          revision: "958574da26e6b6e0",
        },
        {
          url: "/_next/static/chunks/pages/index-958574da26e6b6e0.js.map",
          revision: "36b8d710bbb1ee534b9b59807117a4d4",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-64d222488277d2fe.js",
          revision: "64d222488277d2fe",
        },
        {
          url: "/_next/static/chunks/webpack-64d222488277d2fe.js.map",
          revision: "d851312b2682eff221d52522252d1084",
        },
        {
          url: "/_next/static/css/ad9d6c6f44083cea.css",
          revision: "ad9d6c6f44083cea",
        },
        {
          url: "/_next/static/css/ad9d6c6f44083cea.css.map",
          revision: "06ac814cd3f2467b152b5c16e0369b3c",
        },
        {
          url: "/_next/static/twwIaRxQ9kHcKdLaxchhJ/_buildManifest.js",
          revision: "2b865a6e053730d8838657d45a9c88e9",
        },
        {
          url: "/_next/static/twwIaRxQ9kHcKdLaxchhJ/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/img/landing/phone-frame.svg",
          revision: "851d715b74a26b3df67842ad65c61672",
        },
        { url: "/manifest.json", revision: "545db43d15f05231b1e9dc8ee029545c" },
        { url: "/vite.svg", revision: "8e3a10e157f75ada21ab742c022d5430" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: c,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
//# sourceMappingURL=sw.js.map
