export namespace Env {
  export const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
  export const isLocal = process.env.MODE !== "production";
  export const version = process.env.NEXT_PUBLIC_TAG_VERSION || "local";
  export const localDatabase = process.env.LOCAL_DATABASE || "";

  export const google = {
    clientId: process.env.GOOGLE_ID ?? "",
    clientSecret: process.env.GOOGLE_SECRET ?? "",
  };

  export const github = {
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
  };

  export const database = {
    host: process.env.DATABASE_HOST,
    db: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USERNAME,
  };
}
