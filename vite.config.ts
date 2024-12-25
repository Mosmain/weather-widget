import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('weather-widget'),
        },
      },
    }),
  ],
  build: {
    minify: 'esbuild',
    lib: {
      entry: './src/main.ts',
      name: 'WeatherWidget',
      fileName: (format) => `weather-widget.${format}.js`,
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
})
