import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function copyRecursiveSync(src, dest) {
  const stat = statSync(src)
  if (stat.isDirectory()) {
    mkdirSync(dest, { recursive: true })
    for (const file of readdirSync(src)) {
      copyRecursiveSync(join(src, file), join(dest, file))
    }
  } else {
    mkdirSync(join(dest, '..'), { recursive: true })
    try { copyFileSync(src, dest) } catch {}
  }
}

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: '0.0.0.0',
    hmr: { clientPort: 443 },
    cors: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    },
    // @ts-ignore - allow e2b preview host
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true
  },
  publicDir: 'public',
  plugins: [
    {
      name: 'copy-images-to-dist',
      closeBundle() {
        try {
          copyRecursiveSync('images', 'dist/images')
        } catch (e) {
          console.warn('Could not copy images folder:', e.message)
        }
      }
    }
  ]
})
