if (!self.define) {
  let e,
    s = {};
  const c = (c, a) => (
    (c = new URL(c + ".js", a).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = s), document.head.appendChild(e);
        } else (e = c), importScripts(c), s();
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, n) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let i = {};
    const d = (e) => c(e, t),
      f = { module: { uri: t }, exports: i, require: d };
    s[t] = Promise.all(a.map((e) => f[e] || d(e))).then((e) => (n(...e), i));
  };
}
define(["./workbox-79e1e353"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/", revision: "31a6MMbW1BgCQH0oGUv3O" },
        {
          url: "/_next/static/31a6MMbW1BgCQH0oGUv3O/_buildManifest.js",
          revision: "f0d76f035b074ce2d18f6ccff2dac821",
        },
        {
          url: "/_next/static/31a6MMbW1BgCQH0oGUv3O/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/109.9803a3ddb9d4a0b2.js",
          revision: "9803a3ddb9d4a0b2",
        },
        {
          url: "/_next/static/chunks/109.9803a3ddb9d4a0b2.js.map",
          revision: "8f0c68089791cd55db018c9802a59ce0",
        },
        {
          url: "/_next/static/chunks/166.b701dfbc38b8e7c6.js",
          revision: "b701dfbc38b8e7c6",
        },
        {
          url: "/_next/static/chunks/166.b701dfbc38b8e7c6.js.map",
          revision: "cc3f4b82b3bf9fc777dc3409609bb6a3",
        },
        {
          url: "/_next/static/chunks/172-262115d786d6f556.js",
          revision: "262115d786d6f556",
        },
        {
          url: "/_next/static/chunks/172-262115d786d6f556.js.map",
          revision: "55ebf3a6fe4aea42c4abe39114290d04",
        },
        {
          url: "/_next/static/chunks/320.cfd33a6cb37ccc9b.js",
          revision: "cfd33a6cb37ccc9b",
        },
        {
          url: "/_next/static/chunks/320.cfd33a6cb37ccc9b.js.map",
          revision: "35a4bbf04388c3461b55b8d8620328ec",
        },
        {
          url: "/_next/static/chunks/341-4972a1a6cead9234.js",
          revision: "4972a1a6cead9234",
        },
        {
          url: "/_next/static/chunks/341-4972a1a6cead9234.js.map",
          revision: "04c3b6c7405e0ce6d37d94e72ef9d7ce",
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
          url: "/_next/static/chunks/4-15dbb297502ec75a.js",
          revision: "15dbb297502ec75a",
        },
        {
          url: "/_next/static/chunks/4-15dbb297502ec75a.js.map",
          revision: "98fed1781fb8d7f3fb4eae60fdc974ff",
        },
        {
          url: "/_next/static/chunks/495-86d668ffc840c313.js",
          revision: "86d668ffc840c313",
        },
        {
          url: "/_next/static/chunks/495-86d668ffc840c313.js.map",
          revision: "da914e6e9f934d372fef75e2de4fc13b",
        },
        {
          url: "/_next/static/chunks/511-bbeae27b2e38bcef.js",
          revision: "bbeae27b2e38bcef",
        },
        {
          url: "/_next/static/chunks/511-bbeae27b2e38bcef.js.map",
          revision: "8dcac56740e7d541fc45f18556e03ff7",
        },
        {
          url: "/_next/static/chunks/556-eeff7c4d25489fbc.js",
          revision: "eeff7c4d25489fbc",
        },
        {
          url: "/_next/static/chunks/556-eeff7c4d25489fbc.js.map",
          revision: "1ae292dce4b0b44565c3e5f5a29c592e",
        },
        {
          url: "/_next/static/chunks/577-0b2523fef512f153.js",
          revision: "0b2523fef512f153",
        },
        {
          url: "/_next/static/chunks/577-0b2523fef512f153.js.map",
          revision: "e171dd2efd80dc04aa7e364139d95fd8",
        },
        {
          url: "/_next/static/chunks/610-16ff89823e9f97b1.js",
          revision: "16ff89823e9f97b1",
        },
        {
          url: "/_next/static/chunks/610-16ff89823e9f97b1.js.map",
          revision: "7c8e418f38a5efb613d5d059a3dc6ce7",
        },
        {
          url: "/_next/static/chunks/721-db036d1c89a7cdce.js",
          revision: "db036d1c89a7cdce",
        },
        {
          url: "/_next/static/chunks/721-db036d1c89a7cdce.js.map",
          revision: "08de1d321294e1d8da1c64dcb16a40f8",
        },
        {
          url: "/_next/static/chunks/754-783959b7fd0ffab3.js",
          revision: "783959b7fd0ffab3",
        },
        {
          url: "/_next/static/chunks/754-783959b7fd0ffab3.js.map",
          revision: "204ff69a947b643b731bf0b6b26728fc",
        },
        {
          url: "/_next/static/chunks/813.2c72c77f2aeeeebe.js",
          revision: "2c72c77f2aeeeebe",
        },
        {
          url: "/_next/static/chunks/813.2c72c77f2aeeeebe.js.map",
          revision: "e54430257d01923bc19a6c98c7ed0dbd",
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
          url: "/_next/static/chunks/main-805bd8c206b04810.js",
          revision: "805bd8c206b04810",
        },
        {
          url: "/_next/static/chunks/main-805bd8c206b04810.js.map",
          revision: "60a5848441f3bd14c2a165b67d4a6cc3",
        },
        {
          url: "/_next/static/chunks/pages/_app-bfedd1b37b580d7e.js",
          revision: "bfedd1b37b580d7e",
        },
        {
          url: "/_next/static/chunks/pages/_app-bfedd1b37b580d7e.js.map",
          revision: "1d2581d78e12c7fa29433d9cbf25019a",
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
          url: "/_next/static/chunks/pages/app-b97ed70bee4e925a.js",
          revision: "b97ed70bee4e925a",
        },
        {
          url: "/_next/static/chunks/pages/app-b97ed70bee4e925a.js.map",
          revision: "c57dc5215096f0e2a0edc7d9f5950946",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-c3ed50c38d3ee547.js",
          revision: "c3ed50c38d3ee547",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-c3ed50c38d3ee547.js.map",
          revision: "682cffeddf69971082556005b67df892",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-2ccd1c370ee4735a.js",
          revision: "2ccd1c370ee4735a",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-2ccd1c370ee4735a.js.map",
          revision: "838cba7c52b5135cf95179c8178ac376",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-1773c84d37461326.js",
          revision: "1773c84d37461326",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-1773c84d37461326.js.map",
          revision: "4ce97fc7f3ee04fbb186ee427dba904d",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-c9b304456a2f5da7.js",
          revision: "c9b304456a2f5da7",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-c9b304456a2f5da7.js.map",
          revision: "0e4b0ddf55b96e1b4c70d6f274f7ade7",
        },
        {
          url: "/_next/static/chunks/pages/app/profile-62cc57dc730ee9fc.js",
          revision: "62cc57dc730ee9fc",
        },
        {
          url: "/_next/static/chunks/pages/app/profile-62cc57dc730ee9fc.js.map",
          revision: "e2f346d555d1bdc6e5e850fb173f6f8f",
        },
        {
          url: "/_next/static/chunks/pages/global-error-d8ef57252429a8cc.js",
          revision: "d8ef57252429a8cc",
        },
        {
          url: "/_next/static/chunks/pages/global-error-d8ef57252429a8cc.js.map",
          revision: "191b936584a42e3932bce6349aca4b20",
        },
        {
          url: "/_next/static/chunks/pages/index-bf0f366ef4af0036.js",
          revision: "bf0f366ef4af0036",
        },
        {
          url: "/_next/static/chunks/pages/index-bf0f366ef4af0036.js.map",
          revision: "a7be362ab01e1fa4422b100c8d54c533",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-7ce327e885a11aec.js",
          revision: "7ce327e885a11aec",
        },
        {
          url: "/_next/static/chunks/webpack-7ce327e885a11aec.js.map",
          revision: "e7629f3c47e7761675399b3782774cf6",
        },
        {
          url: "/_next/static/css/2017b47afece6b11.css",
          revision: "2017b47afece6b11",
        },
        {
          url: "/_next/static/css/2017b47afece6b11.css.map",
          revision: "b8e4967f9df8eeec2b8f684445ff7751",
        },
        {
          url: "/img/landing/phone-frame.svg",
          revision: "851d715b74a26b3df67842ad65c61672",
        },
        { url: "/manifest.json", revision: "e4f4cd7c789c6d628a9c252c16a01448" },
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
