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
        // PRIMARY CYBER COLORS - Основные цвета
        // ============================================
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
        
        // ============================================
        // LIGHT THEME - Светлая тема (Профессиональная)
        // ============================================
        light: {
          // Фоновые цвета
          bg: {
            primary: '#f8fafc',      // Основной фон - нежный серо-голубой
            secondary: '#ffffff',     // Карточки - чистый белый
            tertiary: '#f1f5f9',     // Альтернативный фон
            quaternary: '#e2e8f0',   // Дополнительный фон
            hover: '#e0f2fe',        // Hover - светлый cyan
            elevated: '#ffffff',     // Поднятые элементы
            input: '#ffffff',        // Поля ввода
          },
          
          // Текстовые цвета с правильной контрастностью
          text: {
            primary: '#0f172a',      // Основной текст - темный navy (контраст 16:1)
            secondary: '#334155',     // Вторичный текст (контраст 10:1)
            tertiary: '#475569',     // Третичный текст (контраст 7:1)
            muted: '#64748b',        // Приглушенный (контраст 5:1)
            disabled: '#94a3b8',     // Неактивный текст
            inverse: '#ffffff',      // Инверсный (на темном фоне)
          },
          
          // Границы
          border: {
            primary: '#e2e8f0',      // Основные границы
            secondary: '#cbd5e1',     // Более заметные
            tertiary: '#94a3b8',     // Сильные границы
            hover: '#0ea5e9',        // Hover границы - sky blue
            focus: '#00c3ff',        // Focus границы - cyber cyan
            input: '#cbd5e1',        // Границы полей ввода
          },
          
          // Акцентные цвета
          accent: {
            primary: '#0ea5e9',      // Основной акцент - sky blue
            secondary: '#8b5cf6',    // Вторичный - фиолетовый
            success: '#10b981',      // Успех - зеленый
            warning: '#f59e0b',      // Предупреждение - янтарный
            error: '#ef4444',        // Ошибка - красный
            info: '#3b82f6',         // Информация - синий
          },
          
          // Состояния элементов
          state: {
            hover: '#f0f9ff',        // Hover состояние
            active: '#e0f2fe',       // Active состояние
            selected: '#dbeafe',     // Выбранное состояние
            disabled: '#f1f5f9',     // Disabled состояние
          }
        },
        
        // ============================================
        // DARK THEME - Темная тема (Cyber Aesthetic)
        // ============================================
        dark: {
          // Фоновые цвета - многослойная глубина
          bg: {
            primary: '#0a0e1a',      // Глубокий темно-синий фон
            secondary: '#0f1419',     // Карточки - чуть светлее
            tertiary: '#1a1f2e',     // Альтернативный фон
            quaternary: '#1e2433',   // Дополнительный уровень
            hover: '#252b3d',        // Hover состояния
            elevated: '#2a3142',     // Поднятые элементы
            input: '#151a24',        // Поля ввода
          },
          
          // Текстовые цвета
          text: {
            primary: '#f8fafc',      // Основной текст - очень светлый
            secondary: '#e2e8f0',     // Вторичный текст
            tertiary: '#cbd5e1',     // Третичный текст
            muted: '#94a3b8',        // Приглушенный
            disabled: '#64748b',     // Неактивный
            inverse: '#0f172a',      // Инверсный (на светлом фоне)
          },
          
          // Границы с glow эффектами
          border: {
            primary: '#1e293b',      // Основные границы
            secondary: '#334155',     // Более заметные
            tertiary: '#475569',     // Сильные границы
            hover: '#0ea5e9',        // Hover границы
            focus: '#00c3ff',        // Focus границы
            glow: 'rgba(0, 195, 255, 0.2)',  // Свечение
            glowHover: 'rgba(0, 195, 255, 0.4)',  // Свечение при hover
            input: '#334155',        // Границы полей ввода
          },
          
          // Акцентные цвета - более яркие для темной темы
          accent: {
            primary: '#00d9ff',      // Основной cyber cyan
            secondary: '#a78bfa',    // Вторичный - светло-фиолетовый
            success: '#34d399',      // Успех - светло-зеленый
            warning: '#fbbf24',      // Предупреждение - желтый
            error: '#f87171',        // Ошибка - светло-красный
            info: '#60a5fa',         // Информация - светло-синий
            pink: '#f472b6',         // Розовый для градиентов
          },
          
          // Состояния элементов
          state: {
            hover: '#1a2234',        // Hover состояние
            active: '#252f45',       // Active состояние
            selected: '#2a3652',     // Выбранное состояние
            disabled: '#1a1f2e',     // Disabled состояние
          }
        },
        
        // ============================================
        // STATUS COLORS - Статусные цвета (унифицированные)
        // ============================================
        status: {
          success: {
            light: '#10b981',
            dark: '#34d399',
            bg: {
              light: '#d1fae5',
              dark: 'rgba(52, 211, 153, 0.1)',
            },
            border: {
              light: '#6ee7b7',
              dark: 'rgba(52, 211, 153, 0.3)',
            }
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
            bg: {
              light: '#fef3c7',
              dark: 'rgba(251, 191, 36, 0.1)',
            },
            border: {
              light: '#fcd34d',
              dark: 'rgba(251, 191, 36, 0.3)',
            }
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
            bg: {
              light: '#fee2e2',
              dark: 'rgba(248, 113, 113, 0.1)',
            },
            border: {
              light: '#fca5a5',
              dark: 'rgba(248, 113, 113, 0.3)',
            }
          },
          info: {
            light: '#3b82f6',
            dark: '#60a5fa',
            bg: {
              light: '#dbeafe',
              dark: 'rgba(96, 165, 250, 0.1)',
            },
            border: {
              light: '#93c5fd',
              dark: 'rgba(96, 165, 250, 0.3)',
            }
          }
        }
      },
      
      // ============================================
      // ГРАДИЕНТЫ
      // ============================================
      backgroundImage: {
        // Фоновые градиенты
        'gradient-light': 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0f9ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        
        // Карточки
        'gradient-card-light': 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        'gradient-card-dark': 'linear-gradient(to bottom right, #1a1f2e, #0f1419)',
        
        // Cyber эффекты
        'gradient-cyber': 'linear-gradient(135deg, #00c3ff 0%, #a78bfa 50%, #f472b6 100%)',
        'gradient-cyber-subtle': 'linear-gradient(135deg, rgba(0, 195, 255, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
        
        // Hover эффекты
        'gradient-hover-light': 'linear-gradient(to right, #e0f2fe, #dbeafe)',
        'gradient-hover-dark': 'linear-gradient(to right, rgba(0, 217, 255, 0.05), rgba(167, 139, 250, 0.05))',
      },
      
      // ============================================
      // ТЕНИ
      // ============================================
      boxShadow: {
        // Light theme shadows
        'light-xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'light-sm': '0 2px 4px 0 rgba(15, 23, 42, 0.08)',
        'light-md': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)',
        'light-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'light-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
        'light-2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
        
        // Dark theme shadows
        'dark-xs': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        
        // Glow effects
        'glow-cyan-sm': '0 0 10px rgba(0, 195, 255, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 195, 255, 0.4), 0 0 40px rgba(0, 195, 255, 0.2)',
        'glow-cyan-lg': '0 0 30px rgba(0, 195, 255, 0.5), 0 0 60px rgba(0, 195, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.4), 0 0 40px rgba(167, 139, 250, 0.2)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.4), 0 0 40px rgba(244, 114, 182, 0.2)',
        
        // Inner shadows
        'inner-light': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      
      // ============================================
      // АНИМАЦИИ
      // ============================================
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
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
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(0, 195, 255, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 195, 255, 0.6), 0 0 30px rgba(0, 195, 255, 0.4)' 
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      
      // ============================================
      // ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
      // ============================================
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}