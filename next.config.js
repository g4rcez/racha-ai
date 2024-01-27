const { withSentryConfig } = require("@sentry/nextjs");
module.exports = withSentryConfig(
  {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: { swcTraceProfiling: true },
    compiler: {
      reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] },
    },
  },
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
