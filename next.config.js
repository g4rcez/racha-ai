const withSerwist = require("@serwist/next").default({
  swSrc: "./src/app/sw.ts",
  swDest: "public/sw.js",
  register: true,
  reloadOnOnline: true,
});

module.exports = withSerwist({
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { swcTraceProfiling: true },
  compiler: {
    removeComments: true,
    reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] },
  },
});
