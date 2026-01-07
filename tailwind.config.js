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
        // Primary cyber colors - улучшенные
        cyber: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00c3ff',  // Основной cyan
          600: '#009ecc',
          700: '#007a99',
          800: '#005566',
          900: '#003033',
        },
        
        // Accent colors для light theme
        light: {
          bg: {
            primary: '#f8fafc',      // Основной фон - мягкий голубовато-серый
            secondary: '#ffffff',     // Карточки - чистый белый
            tertiary: '#f1f5f9',     // Альтернативный фон
            hover: '#e2e8f0',        // Hover состояния
          },
          text: {
            primary: '#0f172a',      // Основной текст - очень темный синий
            secondary: '#475569',     // Вторичный текст
            tertiary: '#64748b',     // Tertiary текст
            muted: '#94a3b8',        // Приглушенный текст
          },
          border: {
            primary: '#e2e8f0',      // Основные границы
            secondary: '#cbd5e1',     // Более заметные границы
            hover: '#94a3b8',        // Hover границы
          },
          accent: {
            blue: '#3b82f6',         // Синий акцент
            purple: '#8b5cf6',       // Фиолетовый
            green: '#10b981',        // Зеленый
            yellow: '#f59e0b',       // Желтый
            red: '#ef4444',          // Красный
          }
        },
        
        // Accent colors для dark theme - улучшенные с cyber aesthetic
        dark: {
          bg: {
            primary: '#0a0e1a',      // Глубокий темно-синий фон
            secondary: '#131820',     // Карточки - темно-серый с синим
            tertiary: '#1a1f2e',     // Альтернативный фон
            hover: '#222938',        // Hover состояния
            elevated: '#2a3142',     // Поднятые элементы
          },
          text: {
            primary: '#f1f5f9',      // Основной текст - светлый
            secondary: '#cbd5e1',     // Вторичный текст
            tertiary: '#94a3b8',     // Tertiary текст
            muted: '#64748b',        // Приглушенный текст
          },
          border: {
            primary: '#1e293b',      // Основные границы
            secondary: '#334155',     // Более заметные границы
            hover: '#475569',        // Hover границы
            glow: '#00c3ff33',       // Свечение для cyber эффекта
          },
          accent: {
            cyan: '#00d9ff',         // Основной cyan
            blue: '#60a5fa',         // Синий
            purple: '#a78bfa',       // Фиолетовый
            green: '#34d399',        // Зеленый
            yellow: '#fbbf24',       // Желтый
            red: '#f87171',          // Красный
            pink: '#f472b6',         // Розовый для градиентов
          }
        },
        
        // Status colors - одинаковые для обеих тем
        status: {
          success: {
            light: '#10b981',
            dark: '#34d399',
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
          },
          info: {
            light: '#3b82f6',
            dark: '#60a5fa',
          }
        }
      },
      
      // Градиенты
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #00c3ff 0%, #8b5cf6 100%)',
        'gradient-card-light': 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        'gradient-card-dark': 'linear-gradient(to bottom right, #1a1f2e, #131820)',
      },
      
      // Тени
      boxShadow: {
        'light-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'light-md': '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
        'light-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
        'light-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
        
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
        
        'glow-cyan': '0 0 20px rgba(0, 195, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 195, 255, 0.2), 0 0 10px rgba(0, 195, 255, 0.2)' 
          },
          '100%': { 
            boxShadow: '0 0 10px rgba(0, 195, 255, 0.4), 0 0 20px rgba(0, 195, 255, 0.4), 0 0 30px rgba(0, 195, 255, 0.3)' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}