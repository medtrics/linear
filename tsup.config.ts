import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/cli.ts", "src/index.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  target: "node18",
  sourcemap: true,
  minify: false,
  splitting: false,
  shims: true,
})
