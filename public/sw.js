if (!self.define) {
  let e,
    s = {};
  const a = (a, n) => (
    (a = new URL(a + ".js", n).href),
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
  self.define = (n, c) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const d = (e) => a(e, t),
      r = { module: { uri: t }, exports: i, require: d };
    s[t] = Promise.all(n.map((e) => r[e] || d(e))).then((e) => (c(...e), i));
  };
}
define(["./workbox-79e1e353"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/", revision: "qMTG-xTXN-o6W5PMS91jH" },
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
          url: "/_next/static/chunks/409.1f9d4802180449bf.js",
          revision: "1f9d4802180449bf",
        },
        {
          url: "/_next/static/chunks/409.1f9d4802180449bf.js.map",
          revision: "a6c2ec4a5a5659eb0cc0f0443e39e00f",
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
          url: "/_next/static/chunks/577-61fa79555c930da4.js",
          revision: "61fa79555c930da4",
        },
        {
          url: "/_next/static/chunks/577-61fa79555c930da4.js.map",
          revision: "67991fea9cd8fbb488c432a9fb2efb7d",
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
          url: "/_next/static/chunks/610-b0973728b9d7edf8.js",
          revision: "b0973728b9d7edf8",
        },
        {
          url: "/_next/static/chunks/610-b0973728b9d7edf8.js.map",
          revision: "96771bfb46387a4ef943a9884065fa10",
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
          url: "/_next/static/chunks/754-bd4a78a56e6d3894.js",
          revision: "bd4a78a56e6d3894",
        },
        {
          url: "/_next/static/chunks/754-bd4a78a56e6d3894.js.map",
          revision: "84d592c3b011071301a10841c62092c2",
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
          url: "/_next/static/chunks/main-93a2da906b79f88a.js",
          revision: "93a2da906b79f88a",
        },
        {
          url: "/_next/static/chunks/main-93a2da906b79f88a.js.map",
          revision: "3c6625038de11bbadef96f7b640be751",
        },
        {
          url: "/_next/static/chunks/pages/_app-ec9fd95e731d1704.js",
          revision: "ec9fd95e731d1704",
        },
        {
          url: "/_next/static/chunks/pages/_app-ec9fd95e731d1704.js.map",
          revision: "84ace85efe07bd540bd8cb4317c70325",
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
          url: "/_next/static/chunks/pages/app-f75dc8ae91738b0c.js",
          revision: "f75dc8ae91738b0c",
        },
        {
          url: "/_next/static/chunks/pages/app-f75dc8ae91738b0c.js.map",
          revision: "26bacbd4057d1a6ee886c52f571db7a1",
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
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-3740a7b73fdfb158.js",
          revision: "3740a7b73fdfb158",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-3740a7b73fdfb158.js.map",
          revision: "321735d9aaa9ce24b139880c7e658c73",
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
          url: "/_next/static/chunks/pages/app/profile-82d623052811967e.js",
          revision: "82d623052811967e",
        },
        {
          url: "/_next/static/chunks/pages/app/profile-82d623052811967e.js.map",
          revision: "96f0f372fcea84e2c4a50aed6d485e95",
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
          url: "/_next/static/chunks/pages/index-8a70003e10e24794.js",
          revision: "8a70003e10e24794",
        },
        {
          url: "/_next/static/chunks/pages/index-8a70003e10e24794.js.map",
          revision: "ac8dbbedd35e7ffe503d49a02bb99652",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-3e0b04de00e08513.js",
          revision: "3e0b04de00e08513",
        },
        {
          url: "/_next/static/chunks/webpack-3e0b04de00e08513.js.map",
          revision: "9174e82598b215eb304e5ac7069b965d",
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
          url: "/_next/static/qMTG-xTXN-o6W5PMS91jH/_buildManifest.js",
          revision: "a756e4b0e422c5783d6adc37eb21495d",
        },
        {
          url: "/_next/static/qMTG-xTXN-o6W5PMS91jH/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/img/landing/phone-frame.svg",
          revision: "851d715b74a26b3df67842ad65c61672",
        },
        { url: "/manifest.json", revision: "545db43d15f05231b1e9dc8ee029545c" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
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
