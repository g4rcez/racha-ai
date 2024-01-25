const withSerwist = require("@serwist/next").default({
  swSrc: "./src/app/sw.ts",
  swDest: "public/sw.js",
  register: true,
  reloadOnOnline: true,
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { swcTraceProfiling: true },
  compiler: {
    reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] },
  },
};

module.exports =
  process.env.NODE_ENV === "development" ? nextConfig : withSerwist(nextConfig);
