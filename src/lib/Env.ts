export namespace Env {
  export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";
  export const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
  export const isLocal = process.env.MODE !== "production";
  export const version = process.env.NEXT_PUBLIC_TAG_VERSION || "local";
}
