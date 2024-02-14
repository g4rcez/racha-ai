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
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const d = (e) => a(e, i),
      r = { module: { uri: i }, exports: t, require: d };
    s[i] = Promise.all(c.map((e) => r[e] || d(e))).then((e) => (n(...e), t));
  };
}
define(["./workbox-79e1e353"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/", revision: "ZwvbYKVYxnM0X9FuBYcua" },
        {
          url: "/_next/static/ZwvbYKVYxnM0X9FuBYcua/_buildManifest.js",
          revision: "ce07b5b641acbdbbb101fc6e74d870ff",
        },
        {
          url: "/_next/static/ZwvbYKVYxnM0X9FuBYcua/_ssgManifest.js",
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
          url: "/_next/static/chunks/166.b5af4d5b95ae5998.js",
          revision: "b5af4d5b95ae5998",
        },
        {
          url: "/_next/static/chunks/166.b5af4d5b95ae5998.js.map",
          revision: "aad519fba868b52e2a57ced6ff8b72ce",
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
          url: "/_next/static/chunks/320.45f83e9835b46391.js",
          revision: "45f83e9835b46391",
        },
        {
          url: "/_next/static/chunks/320.45f83e9835b46391.js.map",
          revision: "1a174d07c3e0503140717140de4d5964",
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
          url: "/_next/static/chunks/485-3e87e3812ef3f923.js",
          revision: "3e87e3812ef3f923",
        },
        {
          url: "/_next/static/chunks/485-3e87e3812ef3f923.js.map",
          revision: "a8d904e68297c58cb5a71bba341b4d20",
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
          url: "/_next/static/chunks/511-7752a6caccb1057c.js",
          revision: "7752a6caccb1057c",
        },
        {
          url: "/_next/static/chunks/511-7752a6caccb1057c.js.map",
          revision: "357cd7993022f51714f4cb2027d24e4d",
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
          url: "/_next/static/chunks/577-e49fe705bd8d5f42.js",
          revision: "e49fe705bd8d5f42",
        },
        {
          url: "/_next/static/chunks/577-e49fe705bd8d5f42.js.map",
          revision: "f70c8c9f87f37b1ea9f2295d8eb645f9",
        },
        {
          url: "/_next/static/chunks/610-9f8d37db53665424.js",
          revision: "9f8d37db53665424",
        },
        {
          url: "/_next/static/chunks/610-9f8d37db53665424.js.map",
          revision: "2465aed730838c46b747171d0a8bf068",
        },
        {
          url: "/_next/static/chunks/754-197a97790902138f.js",
          revision: "197a97790902138f",
        },
        {
          url: "/_next/static/chunks/754-197a97790902138f.js.map",
          revision: "63ed1673ba2965d0b16e98817eff7004",
        },
        {
          url: "/_next/static/chunks/813.138d29b4ef8213dd.js",
          revision: "138d29b4ef8213dd",
        },
        {
          url: "/_next/static/chunks/813.138d29b4ef8213dd.js.map",
          revision: "22dfc843c7369de31ce23584dbf3c462",
        },
        {
          url: "/_next/static/chunks/946-2b63ecd94d9682b5.js",
          revision: "2b63ecd94d9682b5",
        },
        {
          url: "/_next/static/chunks/946-2b63ecd94d9682b5.js.map",
          revision: "7b6caf117426d9d4092f60e59c5c54e3",
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
          url: "/_next/static/chunks/pages/_app-5a5a1f2ac38ee225.js",
          revision: "5a5a1f2ac38ee225",
        },
        {
          url: "/_next/static/chunks/pages/_app-5a5a1f2ac38ee225.js.map",
          revision: "00184c16570ec2a477005252a7c581d1",
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
          url: "/_next/static/chunks/pages/app-be68eb48b0f93fff.js",
          revision: "be68eb48b0f93fff",
        },
        {
          url: "/_next/static/chunks/pages/app-be68eb48b0f93fff.js.map",
          revision: "c9af722070a6e19729622c6328a61708",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-aff7c33a960b3396.js",
          revision: "aff7c33a960b3396",
        },
        {
          url: "/_next/static/chunks/pages/app/cart-aff7c33a960b3396.js.map",
          revision: "efd25a2ae5b03e1ecb2f77e4f3152edb",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-f25083fd913bba35.js",
          revision: "f25083fd913bba35",
        },
        {
          url: "/_next/static/chunks/pages/app/cart/%5Bid%5D-f25083fd913bba35.js.map",
          revision: "c482b9c049f9f28eef2b3261a9c11dd5",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-72f5cd9828526cc0.js",
          revision: "72f5cd9828526cc0",
        },
        {
          url: "/_next/static/chunks/pages/app/debug/page-72f5cd9828526cc0.js.map",
          revision: "4bd9ca8637b7afd4769a330ffc69c787",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-530de3c174a97891.js",
          revision: "530de3c174a97891",
        },
        {
          url: "/_next/static/chunks/pages/app/friends-530de3c174a97891.js.map",
          revision: "741d718064840dae5da3b99356af51aa",
        },
        {
          url: "/_next/static/chunks/pages/app/profile-04baa3789532f10b.js",
          revision: "04baa3789532f10b",
        },
        {
          url: "/_next/static/chunks/pages/app/profile-04baa3789532f10b.js.map",
          revision: "a72a0ed45b02eaea62cb7063e2a52ef9",
        },
        {
          url: "/_next/static/chunks/pages/app/social-2d9e40555d7d0051.js",
          revision: "2d9e40555d7d0051",
        },
        {
          url: "/_next/static/chunks/pages/app/social-2d9e40555d7d0051.js.map",
          revision: "90b6bb95786967f97a53e931dac48c0e",
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
          url: "/_next/static/chunks/pages/index-481c709765bde1a4.js",
          revision: "481c709765bde1a4",
        },
        {
          url: "/_next/static/chunks/pages/index-481c709765bde1a4.js.map",
          revision: "545b65e5abcbccb16a42f5d92fff2de1",
        },
        {
          url: "/_next/static/chunks/pages/login-9da5a031d784532e.js",
          revision: "9da5a031d784532e",
        },
        {
          url: "/_next/static/chunks/pages/login-9da5a031d784532e.js.map",
          revision: "0fe969aedb701492e24076b252dac196",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-9470dc1a86946dd6.js",
          revision: "9470dc1a86946dd6",
        },
        {
          url: "/_next/static/chunks/webpack-9470dc1a86946dd6.js.map",
          revision: "54584713d975982d1fe0779508e827e6",
        },
        {
          url: "/_next/static/css/208902f5a47219b1.css",
          revision: "208902f5a47219b1",
        },
        {
          url: "/_next/static/css/208902f5a47219b1.css.map",
          revision: "143709f13034a69aad68759b297a1ef5",
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
