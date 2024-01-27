const { withSentryConfig } = require("@sentry/nextjs");
const { randomUUID } = require("node:crypto");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] },
  },
};

module.exports = withSentryConfig(
  require("next-pwa")({
    scope: "/",
    dest: "public",
    reloadOnOnline: true,
    dynamicStartUrl: false,
    cacheOnFrontEndNav: true,
  })(nextConfig),
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
