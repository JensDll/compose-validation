import { fileURLToPath } from 'url'
import path from 'path'

import { defineConfig, AliasOptions } from 'vite'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

const baseDir = fileURLToPath(new URL('.', import.meta.url))

const alias: AliasOptions = {
  '~': path.resolve(baseDir, 'src')
}

export default defineConfig({
  plugins: [
    vue2({
      jsx: false
    })
  ],
  resolve: {
    alias
  }
})
