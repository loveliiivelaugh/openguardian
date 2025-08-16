import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/utilities/api'),
      '@store': path.resolve(__dirname, './src/utilities/store'),
      '@scripts': path.resolve(__dirname, './src/utilities/scripts'),
      '@helpers': path.resolve(__dirname, './src/utilities/helpers'),
      '@components': path.resolve(__dirname, './src/components'),
      '@custom': path.resolve(__dirname, './src/components/Custom'),
      '@mui2': path.resolve(__dirname, './src/components/Mui'),
      '@lib': path.resolve(__dirname, './src/utilities/lib'),
      '@theme': path.resolve(__dirname, './src/utilities/theme'),
      '@utilities': path.resolve(__dirname, './src/utilities'),
      '@config': path.resolve(__dirname, './src/utilities/config'),
      '@assets': path.resolve(__dirname, './src/utilities/assets'),
    }
  }
})
