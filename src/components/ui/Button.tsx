// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: cn(
        'bg-cyber-500 hover:bg-cyber-600 text-white',
        'shadow-glow-cyan hover:shadow-glow-cyan',
        'hover:scale-105 active:scale-95',
        'disabled:hover:scale-100'
      ),
      secondary: cn(
        'bg-light-bg-tertiary hover:bg-light-bg-hover',
        'dark:bg-dark-bg-tertiary dark:hover:bg-dark-bg-hover',
        'text-light-text-primary dark:text-dark-text-primary',
        'border border-light-border-primary dark:border-dark-border-primary',
        'hover:border-light-border-secondary dark:hover:border-dark-border-secondary',
        'shadow-light-sm hover:shadow-light-md',
        'dark:shadow-dark-sm dark:hover:shadow-dark-md'
      ),
      danger: cn(
        'bg-status-error-light dark:bg-status-error-dark',
        'hover:bg-red-600 dark:hover:bg-red-600',
        'text-white',
        'hover:scale-105 active:scale-95',
        'disabled:hover:scale-100'
      ),
      ghost: cn(
        'hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover',
        'text-light-text-secondary dark:text-dark-text-secondary',
        'hover:text-light-text-primary dark:hover:text-dark-text-primary'
      ),
      success: cn(
        'bg-status-success-light dark:bg-status-success-dark',
        'hover:bg-green-600 dark:hover:bg-green-500',
        'text-white',
        'hover:scale-105 active:scale-95',
        'disabled:hover:scale-100'
      ),
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size], 
          loading && 'opacity-75 cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';