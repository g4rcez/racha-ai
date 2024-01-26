const { withSentryConfig } = require("@sentry/nextjs");

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

const envConfig =
  process.env.NODE_ENV === "development" ? nextConfig : withSerwist(nextConfig);

module.exports = withSentryConfig(
  envConfig,
  { silent: true, org: "g4rcez", project: "racha-ai" },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
);
