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
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,
        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: false,
        tunnelRoute: "/monitoring",
        // Hides source maps from generated client bundles
        hideSourceMaps: true,
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,
        // Enables automatic instrumentation of Vercel Cron Monitors.
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true
    }
);
