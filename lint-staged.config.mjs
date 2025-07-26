export default {
  "**/*.{json,ts}": "biome check",
  "**/*.{ts}": () => "tsc --noEmit",
}
