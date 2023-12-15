// vite.config.mts
/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: { "import.meta.vitest": "undefined" },
  plugins: [react()],
  test: {
    includeSource: ["./**/*.{ts,js}"],
    globals: true,
    environment: "jsdom",
    // coverage: { reporter: ["text", "html"] },
  },
});
