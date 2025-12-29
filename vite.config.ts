import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    solid({
      include: ["**/*.fiber.tsx"],
      moduleName: "@ensolid/fiber",
      generate: "universal",
    } as any),
    solid({
      exclude: ["**/*.fiber.tsx"],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@ensolid/baseui": path.resolve(__dirname, "./packages/baseui/src"),
      "@ensolid/radix": path.resolve(__dirname, "./packages/radix/src"),
      "@ensolid/visx": path.resolve(__dirname, "./packages/visx/src"),
      "@ensolid/fiber": path.resolve(__dirname, "./packages/fiber/src"),
      "@ensolid/solidflow": path.resolve(__dirname, "./packages/solidflow/src"),
      "@ensolid/aisolid": path.resolve(__dirname, "./packages/aisolid/src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 如果使用本地模拟 API，可以取消注释下面的配置
        // configure: (proxy, _options) => {
        //   proxy.on('error', (err, _req, _res) => {
        //     console.log('proxy error', err);
        //   });
        // },
      },
    },
  },
});
