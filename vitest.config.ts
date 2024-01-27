import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "./tests",
  resolve: { alias: { "~": path.resolve(__dirname, "./src/") } },
  test: { clearMocks: true, globals: true },
});
