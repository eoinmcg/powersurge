import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  server: {
    host: true,
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})

