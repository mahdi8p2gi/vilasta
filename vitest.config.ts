import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}", "tests/component/**/*.{test,spec}.{ts,tsx}", "tests/integration/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/lib/**", "src/store/**"],
      exclude: ["src/components/**", "src/app/api/**", "src/types/**", "src/lib/db.ts", "src/config/**"],
      thresholds: { statements: 70, branches: 60, functions: 70, lines: 70 },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
