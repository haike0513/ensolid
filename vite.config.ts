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
      "@resolid/baseui": path.resolve(__dirname, "./packages/baseui/src"),
      "@resolid/radix": path.resolve(__dirname, "./packages/radix/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
