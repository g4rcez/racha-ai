const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { instrumentationHook: true },
  compiler: {
    reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] },
  },
};

const withPlugins = false ? withSentryConfig : (t) => t;

module.exports = withPlugins(
  require("next-pwa")({
    scope: "/app",
    dest: "public",
    reloadOnOnline: true,
    dynamicStartUrl: false,
    cacheOnFrontEndNav: true,
    disable: process.env.NODE_ENV !== "production",
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
