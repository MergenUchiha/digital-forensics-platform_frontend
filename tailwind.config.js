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
        // ============================================
        // PRIMARY CYBER COLORS - Акцентные цвета
        // ============================================
        cyber: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00d9ff',  // Основной cyan - яркий и заметный
          600: '#00b8db',
          700: '#0096b7',
          800: '#007493',
          900: '#005c75',
        },
        
        // ============================================
        // LIGHT THEME - Светлая тема
        // Профессиональный минималистичный дизайн
        // ============================================
        light: {
          // Фоновые цвета
          bg: {
            primary: '#f8f9fa',        // Основной фон - очень светлый серый
            secondary: '#ffffff',       // Карточки - чистый белый
            tertiary: '#f1f3f5',       // Третичный фон
            hover: '#e7f5ff',          // Hover - светлый cyan
            input: '#ffffff',          // Поля ввода
            elevated: '#ffffff',       // Поднятые элементы
          },
          
          // Текстовые цвета - МАКСИМАЛЬНЫЙ КОНТРАСТ
          text: {
            primary: '#0a0e1a',        // Основной текст - почти черный (20:1 контраст)
            secondary: '#1f2937',      // Вторичный текст (16:1 контраст)
            tertiary: '#374151',       // Третичный текст (10:1 контраст)
            muted: '#6b7280',          // Приглушенный (6:1 контраст)
            disabled: '#9ca3af',       // Неактивный текст
          },
          
          // Границы - более заметные
          border: {
            primary: '#e5e7eb',        // Основные границы (более темные)
            secondary: '#d1d5db',      // Более заметные
            hover: '#00d9ff',          // Hover границы
            input: '#d1d5db',          // Границы полей ввода
            glow: 'rgba(0, 217, 255, 0.3)',  // Легкое свечение
          },
          
          // Акцентные цвета для светлой темы
          accent: {
            primary: '#00d9ff',        // Основной cyan
            secondary: '#8b5cf6',      // Фиолетовый
          },
          
          // Состояния
          state: {
            hover: '#f0f9ff',          // Hover
            active: '#e0f2fe',         // Active
            focus: 'rgba(0, 217, 255, 0.1)',  // Focus
          }
        },
        
        // ============================================
        // DARK THEME - Темная тема
        // Современный dark mode с cyber акцентами
        // ============================================
        dark: {
          // Фоновые цвета - глубокие и насыщенные
          bg: {
            primary: '#0d1117',        // Основной фон - глубокий черно-синий
            secondary: '#161b22',      // Карточки - немного светлее
            tertiary: '#21262d',       // Третичный фон
            hover: '#30363d',          // Hover состояния
            input: '#0d1117',          // Поля ввода
            elevated: '#1c2128',       // Поднятые элементы
          },
          
          // Текстовые цвета - ЯРКИЕ И ЧЕТКИЕ
          text: {
            primary: '#f0f6fc',        // Основной текст - очень яркий белый
            secondary: '#c9d1d9',      // Вторичный текст - светло-серый
            tertiary: '#8b949e',       // Третичный текст
            muted: '#6e7681',          // Приглушенный
            disabled: '#484f58',       // Неактивный
          },
          
          // Границы с glow эффектами
          border: {
            primary: '#30363d',        // Основные границы
            secondary: '#3d444d',      // Более заметные
            hover: '#00d9ff',          // Hover границы
            input: '#30363d',          // Границы полей ввода
            glow: 'rgba(0, 217, 255, 0.4)',  // Свечение для акцентов
          },
          
          // Акцентные цвета для темной темы - ЯРКИЕ
          accent: {
            primary: '#00d9ff',        // Основной cyber cyan
            secondary: '#a78bfa',      // Светлый фиолетовый
            pink: '#f472b6',           // Розовый для градиентов
          },
          
          // Состояния
          state: {
            hover: '#1c2128',          // Hover
            active: '#21262d',         // Active
            focus: 'rgba(0, 217, 255, 0.2)',  // Focus
          }
        },
        
        // ============================================
        // STATUS COLORS - Статусные цвета
        // Унифицированы для обеих тем
        // ============================================
        status: {
          // Success - Зеленый
          success: {
            light: '#059669',          // Для светлой темы (темно-зеленый)
            dark: '#34d399',           // Для темной темы - ярче
          },
          // Warning - Желтый/Оранжевый
          warning: {
            light: '#d97706',          // Для светлой темы (темно-оранжевый)
            dark: '#fbbf24',           // Для темной темы - ярче
          },
          // Error - Красный
          error: {
            light: '#dc2626',          // Для светлой темы (темно-красный)
            dark: '#f87171',           // Для темной темы - ярче
          },
          // Info - Синий
          info: {
            light: '#2563eb',          // Для светлой темы (темно-синий)
            dark: '#60a5fa',           // Для темной темы - ярче
          }
        }
      },
      
      // ============================================
      // ГРАДИЕНТЫ
      // ============================================
      backgroundImage: {
        // Cyber градиенты
        'gradient-cyber': 'linear-gradient(135deg, #00d9ff 0%, #a78bfa 50%, #f472b6 100%)',
        'gradient-cyber-subtle': 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
        
        // Фоновые градиенты для светлой темы
        'gradient-light-bg': 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)',
        
        // Фоновые градиенты для темной темы
        'gradient-dark-bg': 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
      },
      
      // ============================================
      // ТЕНИ
      // ============================================
      boxShadow: {
        // Light theme shadows - мягкие и элегантные
        'light-sm': '0 1px 2px 0 rgba(26, 32, 44, 0.05)',
        'light-md': '0 4px 6px -1px rgba(26, 32, 44, 0.1), 0 2px 4px -1px rgba(26, 32, 44, 0.06)',
        'light-lg': '0 10px 15px -3px rgba(26, 32, 44, 0.1), 0 4px 6px -2px rgba(26, 32, 44, 0.05)',
        'light-xl': '0 20px 25px -5px rgba(26, 32, 44, 0.1), 0 10px 10px -5px rgba(26, 32, 44, 0.04)',
        'light-2xl': '0 25px 50px -12px rgba(26, 32, 44, 0.15)',
        
        // Dark theme shadows - более глубокие
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.6)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.8), 0 4px 6px -2px rgba(0, 0, 0, 0.6)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.7)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
        
        // Glow effects для темной темы
        'glow-cyan-sm': '0 0 10px rgba(0, 217, 255, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
        'glow-cyan-lg': '0 0 30px rgba(0, 217, 255, 0.6), 0 0 60px rgba(0, 217, 255, 0.4)',
      },
      
      // ============================================
      // АНИМАЦИИ
      // ============================================
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.4)' 
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}