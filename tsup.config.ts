import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  // Important: don't bundle Prisma; let Node load it from node_modules
  external: ["@prisma/client", ".prisma/client", "prisma"],
});
