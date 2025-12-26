import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: {
    alias: {
      "@ensolid/baseui": path.resolve(__dirname, "./packages/baseui/src"),
      "@ensolid/radix": path.resolve(__dirname, "./packages/radix/src"),
      "@ensolid/solidflow": path.resolve(__dirname, "./packages/solidflow/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
