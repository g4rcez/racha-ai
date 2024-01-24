export namespace Env {
  export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || "";
  export const ownerEmail = import.meta.env.VITE_OWNER_EMAIL || "";
  export const isLocal = import.meta.env.MODE !== "production";
  export const version = import.meta.env.VITE_TAG_VERSION || "local";
}
