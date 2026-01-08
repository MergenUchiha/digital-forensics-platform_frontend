import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')

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
      port: 3000,
      host: true,
      strictPort: false,
      // Proxy API requests to backend
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
      // Enable CORS for development
      cors: true,
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
      port: 3000,
      host: true,
      strictPort: false,
    },
  }
})