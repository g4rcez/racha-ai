if(!self.define){let e,a={};const s=(s,c)=>(s=new URL(s+".js",c).href,a[s]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=a,document.head.appendChild(e)}else e=s,importScripts(s),a()})).then((()=>{let e=a[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(a[i])return;let t={};const r=e=>s(e,i),d={module:{uri:i},exports:t,require:r};a[i]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-79e1e353"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/",revision:"CiTx2Wozyjt2e414GPvnA"},{url:"/_next/static/CiTx2Wozyjt2e414GPvnA/_buildManifest.js",revision:"897612d7d782597d19bf02712dd5f29f"},{url:"/_next/static/CiTx2Wozyjt2e414GPvnA/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/32.5c58e64136828379.js",revision:"5c58e64136828379"},{url:"/_next/static/chunks/32.5c58e64136828379.js.map",revision:"11b821473b67c9c1860abdea40fcb4e7"},{url:"/_next/static/chunks/424-04efea1033266e0a.js",revision:"04efea1033266e0a"},{url:"/_next/static/chunks/424-04efea1033266e0a.js.map",revision:"cf3235fe5c39f18ada8da5d2aab87fba"},{url:"/_next/static/chunks/434-763b0173c7546cbd.js",revision:"763b0173c7546cbd"},{url:"/_next/static/chunks/434-763b0173c7546cbd.js.map",revision:"0acb59e031793aa1a3e0d686ba9ce445"},{url:"/_next/static/chunks/471.3638469f2f6e87e1.js",revision:"3638469f2f6e87e1"},{url:"/_next/static/chunks/471.3638469f2f6e87e1.js.map",revision:"1cd36926e2af458e2cc2dec0017358af"},{url:"/_next/static/chunks/644-1c2febf983420afb.js",revision:"1c2febf983420afb"},{url:"/_next/static/chunks/644-1c2febf983420afb.js.map",revision:"f75d8f0e8c4337e9d66d966c3576097e"},{url:"/_next/static/chunks/783.bbd8a40e1dc1f0a9.js",revision:"bbd8a40e1dc1f0a9"},{url:"/_next/static/chunks/783.bbd8a40e1dc1f0a9.js.map",revision:"6de884ea5478199b80257a7935134f88"},{url:"/_next/static/chunks/800.9dd8928e204a178c.js",revision:"9dd8928e204a178c"},{url:"/_next/static/chunks/800.9dd8928e204a178c.js.map",revision:"905dafadf57abf826aeaef978ad9c352"},{url:"/_next/static/chunks/817.62bad1c9ed0aa7dc.js",revision:"62bad1c9ed0aa7dc"},{url:"/_next/static/chunks/817.62bad1c9ed0aa7dc.js.map",revision:"4b8078f3c4f6c42fe0e01b1021745d80"},{url:"/_next/static/chunks/846.da8e8827498e34e7.js",revision:"da8e8827498e34e7"},{url:"/_next/static/chunks/846.da8e8827498e34e7.js.map",revision:"f96cedaa3b5d053f4a9c755041d6df6c"},{url:"/_next/static/chunks/897-9b85a1befcc47c7d.js",revision:"9b85a1befcc47c7d"},{url:"/_next/static/chunks/897-9b85a1befcc47c7d.js.map",revision:"3b96266f35d114da152b370e1d6b5ce2"},{url:"/_next/static/chunks/939-6a6c3c5277f1731b.js",revision:"6a6c3c5277f1731b"},{url:"/_next/static/chunks/939-6a6c3c5277f1731b.js.map",revision:"a5d36ec8579135eba3a873ef75df15a7"},{url:"/_next/static/chunks/95-bce73eacb0b0c78b.js",revision:"bce73eacb0b0c78b"},{url:"/_next/static/chunks/95-bce73eacb0b0c78b.js.map",revision:"a47a844ff98cee88ff649b0967a69983"},{url:"/_next/static/chunks/999-51bd68796511d745.js",revision:"51bd68796511d745"},{url:"/_next/static/chunks/999-51bd68796511d745.js.map",revision:"fe7eae579269420e53e7900b4fbfdbe2"},{url:"/_next/static/chunks/framework-5eea1a21a68cb00b.js",revision:"5eea1a21a68cb00b"},{url:"/_next/static/chunks/framework-5eea1a21a68cb00b.js.map",revision:"e23c6f6891b5090eab267b0f245a5d17"},{url:"/_next/static/chunks/main-0f8398319c27b889.js",revision:"0f8398319c27b889"},{url:"/_next/static/chunks/main-0f8398319c27b889.js.map",revision:"489743aa83bbdd16e8e7b302cfe1a1bf"},{url:"/_next/static/chunks/pages/_app-5a8d5ccd09a0e76e.js",revision:"5a8d5ccd09a0e76e"},{url:"/_next/static/chunks/pages/_app-5a8d5ccd09a0e76e.js.map",revision:"5b3b8d0a353279c62af8b4ceb3451fe6"},{url:"/_next/static/chunks/pages/_error-002bd5a4fca439ff.js",revision:"002bd5a4fca439ff"},{url:"/_next/static/chunks/pages/_error-002bd5a4fca439ff.js.map",revision:"02c243b74a96c1e7ac51c6e2564b6840"},{url:"/_next/static/chunks/pages/app-caa148b0a93fff0c.js",revision:"caa148b0a93fff0c"},{url:"/_next/static/chunks/pages/app-caa148b0a93fff0c.js.map",revision:"ed582acbf05f38da9490e809af2846d0"},{url:"/_next/static/chunks/pages/app/debug/page-827231ccfbe3b706.js",revision:"827231ccfbe3b706"},{url:"/_next/static/chunks/pages/app/debug/page-827231ccfbe3b706.js.map",revision:"f74d0acffeb9015f1010d33736437634"},{url:"/_next/static/chunks/pages/app/friends-b4a0b90afc6ccf08.js",revision:"b4a0b90afc6ccf08"},{url:"/_next/static/chunks/pages/app/friends-b4a0b90afc6ccf08.js.map",revision:"84288575d75378b69104729834b13927"},{url:"/_next/static/chunks/pages/app/orders/%5Bid%5D-6e5ea6e2bbad1592.js",revision:"6e5ea6e2bbad1592"},{url:"/_next/static/chunks/pages/app/orders/%5Bid%5D-6e5ea6e2bbad1592.js.map",revision:"a6d274cc4373505c55c06588f9225fe1"},{url:"/_next/static/chunks/pages/app/orders/new-4e39484eda66de59.js",revision:"4e39484eda66de59"},{url:"/_next/static/chunks/pages/app/orders/new-4e39484eda66de59.js.map",revision:"f35a259d9a220a004bbaa8787078579f"},{url:"/_next/static/chunks/pages/app/orders/new/product-98074508de7799f5.js",revision:"98074508de7799f5"},{url:"/_next/static/chunks/pages/app/orders/new/product-98074508de7799f5.js.map",revision:"6322cd5ff8ceee33e5fdf32a42aafbc8"},{url:"/_next/static/chunks/pages/app/orders/new/product/%5Bid%5D-9b3d2c3cacba4c88.js",revision:"9b3d2c3cacba4c88"},{url:"/_next/static/chunks/pages/app/orders/new/product/%5Bid%5D-9b3d2c3cacba4c88.js.map",revision:"491524125ef8cf04d5ae317d6ef0f937"},{url:"/_next/static/chunks/pages/app/profile-ce1f9caeb5698251.js",revision:"ce1f9caeb5698251"},{url:"/_next/static/chunks/pages/app/profile-ce1f9caeb5698251.js.map",revision:"4f4a1f662b86732ee44fe96486bab258"},{url:"/_next/static/chunks/pages/global-error-8fda56a7cb76e038.js",revision:"8fda56a7cb76e038"},{url:"/_next/static/chunks/pages/global-error-8fda56a7cb76e038.js.map",revision:"9901ffbb22748e73e354ad2a59084834"},{url:"/_next/static/chunks/pages/index-1c87d1024074099e.js",revision:"1c87d1024074099e"},{url:"/_next/static/chunks/pages/index-1c87d1024074099e.js.map",revision:"f4b7acfc7cd440c7d6fb34dc85efa0fe"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-a33b7048334e71e1.js",revision:"a33b7048334e71e1"},{url:"/_next/static/chunks/webpack-a33b7048334e71e1.js.map",revision:"c1067ed7ef7943f487fac1e5665a6ee6"},{url:"/_next/static/css/cd179f2a667723d7.css",revision:"cd179f2a667723d7"},{url:"/_next/static/css/cd179f2a667723d7.css.map",revision:"5c4771b6a38823d15166bef130fcbeec"},{url:"/img/landing/phone-frame.svg",revision:"851d715b74a26b3df67842ad65c61672"},{url:"/manifest.json",revision:"e4f4cd7c789c6d628a9c252c16a01448"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
//# sourceMappingURL=sw.js.map
