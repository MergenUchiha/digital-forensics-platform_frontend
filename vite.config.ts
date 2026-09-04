import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        // Babel configuration for emotion or other needs
        babel: {
          plugins: [],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      // 3000 is one of the origins the backend allows out of the box through
      // CORS_ORIGINS. `strictPort` makes a conflict an error rather than a
      // silent move to another port the backend would then refuse.
      port: 3000,
      host: true,
      strictPort: true,
      // No proxy: the app calls VITE_API_URL directly. The proxy that was
      // here pointed `/api` at `env.VITE_API_URL`, which already ends in
      // `/api`, so a request for `/api/cases` would have gone to
      // `…/api/api/cases`.
    },

    build: {
      // Output directory
      outDir: 'dist',
      
      // Generate sourcemap for production
      sourcemap: mode === 'development',
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            // React vendor chunk
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // UI libraries
            'ui-vendor': ['framer-motion', 'lucide-react'],
            
            // Data visualization
            'chart-vendor': ['recharts', 'react-simple-maps'],
            
            // Form & validation
            'form-vendor': ['zod'],
            
            // Date utilities
            'date-vendor': ['date-fns'],
            
            // PDF generation
            'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          },
        },
      },
      
      // Minification
      minify: 'esbuild',
      
      // Target browsers
      target: 'es2015',
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'date-fns',
        'zod',
        'framer-motion',
        'lucide-react',
      ],
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    // CSS configuration
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase',
      },
    },

    // Preview server configuration
    preview: {
      // Also in CORS_ORIGINS, so a production build can be checked locally.
      port: 5173,
      host: true,
      strictPort: true,
    },
  }
})