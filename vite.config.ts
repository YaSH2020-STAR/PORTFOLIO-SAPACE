import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/analytics',
      'firebase/firestore',
      '@paypal/react-paypal-js',
      '@stripe/stripe-js'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
      transformMixedEsModules: true
    },
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-core': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'firebase-analytics': ['firebase/analytics'],
          'payment': ['@paypal/react-paypal-js', '@stripe/stripe-js']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});