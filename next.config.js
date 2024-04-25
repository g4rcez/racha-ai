const { withSentryConfig } = require("@sentry/nextjs");

const withPlugins = (t) => t;

/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: { instrumentationHook: true },
    compiler: {
        reactRemoveProperties: { properties: ["^data-test$", "^data-testid$"] }
    }
};

const withNextPWA = withPlugins(
    require("next-pwa")({
        scope: "/app",
        dest: "public",
        reloadOnOnline: true,
        dynamicStartUrl: false,
        cacheOnFrontEndNav: true,
        disable: process.env.NODE_ENV !== "production"
    })(nextConfig),
    { silent: true, org: "g4rcez", project: "racha-ai" },
    {
        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true
    }
);

module.exports = withSentryConfig(
    withNextPWA,
    {
        silent: true,
        org: "g4rcez",
        project: "racha-ai"
    },
    {
        widenClientFileUpload: true,
        transpileClientSDK: false,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true
    }
);
