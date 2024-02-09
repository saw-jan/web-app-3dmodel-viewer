import { defineConfig } from '@ownclouders/extension-sdk'

export default defineConfig({
  name: 'web-3dmodel-viewer',
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: 'extension.js'
      }
    }
  }
})
