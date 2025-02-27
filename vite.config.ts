import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return {
      mode: mode,
      appType: 'spa',
      plugins: [svelte()],
      build: {
        outDir: './dist/dev',
        sourcemap: true,
      }
    }
  } else if (mode === 'staging') {
    return {
      mode: mode,
      appType: 'spa',
      plugins: [svelte()],
      build: {
        outDir: './dist/stage',
      }
    }
  } else if (mode === 'production') {
    return {
      mode: mode,
      appType: 'spa',
      plugins: [svelte()],
      build: {
        outDir: './dist/prod',
      }
    }
  }

  // default
  return {
    mode: mode,
    appType: 'spa',
    plugins: [svelte()],
    build: {
      outDir: './dist/dev',
      sourcemap: true
    }
  }
})
