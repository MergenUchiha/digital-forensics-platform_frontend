/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyber theme colors
        cyber: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00d9ff',
          600: '#00b8db',
          700: '#0096b7',
          800: '#007493',
          900: '#005c75',
        },
        
        // Semantic colors using CSS variables (auto-switch with theme)
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'bg-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        'bg-hover': 'rgb(var(--color-bg-hover) / <alpha-value>)',
        
        'border-primary': 'rgb(var(--color-border-primary) / <alpha-value>)',
        'border-secondary': 'rgb(var(--color-border-secondary) / <alpha-value>)',
        
        'status-success': 'rgb(var(--color-status-success) / <alpha-value>)',
        'status-warning': 'rgb(var(--color-status-warning) / <alpha-value>)',
        'status-error': 'rgb(var(--color-status-error) / <alpha-value>)',
        'status-info': 'rgb(var(--color-status-info) / <alpha-value>)',
      },
      
      boxShadow: {
        // Light theme shadows
        'light-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
        'light-md': '0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)',
        'light-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08)',
        'light-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
        'light-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
        
        // Dark theme shadows
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.6)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.8), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 1)',
        
        // Glow effects
        'glow-cyan-sm': '0 0 10px rgba(0, 217, 255, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5)',
        'glow-cyan-lg': '0 0 30px rgba(0, 217, 255, 0.6)',
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      transitionDuration: {
        '400': '400ms',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}