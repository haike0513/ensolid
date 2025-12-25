import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@resolid/baseui': path.resolve(__dirname, './packages/baseui/src'),
    },
  },
})
