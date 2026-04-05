import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
        viteCompression({ algorithm: 'gzip', threshold: 1024 }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/') ||
                        id.includes('node_modules/framer-motion/') ||
                        id.includes('node_modules/@radix-ui/')
                    ) {
                        return 'vendor'
                    }
                },
            },
        },
    },
})
