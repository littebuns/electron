import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    server: {
      proxy: {
        '/dmc-doc': {
          target: 'http://localhost:9037',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^/, '')
        },
        '/ccsOrder': {
          target: 'http://47.111.16.130:9070',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ccsOrder/, '')
        }
      }
    }
  },
})
