import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', '@ownclouders/web-client', '@ownclouders/web-pkg'],
      input: 'src/index.ts',
      output: {
        format: 'amd',
        dir: 'dist',
        entryFileNames: 'extension.js'
      },
      preserveEntrySignatures: 'strict'
    }
  },
  plugins: [
    vue({
      // set to true when switching to esm
      customElement: false
    })
  ]
})
