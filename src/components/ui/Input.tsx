import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              // Базовые стили
              'w-full px-4 py-2 rounded-lg',
              'transition-all duration-200',
              
              // Цвета - автоматически меняются по теме
              'bg-bg-secondary',
              'text-text-primary',
              'placeholder-text-muted',
              
              // Границы
              error 
                ? 'border-2 border-status-error'
                : 'border border-border-primary',
              
              // Focus состояние
              'focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent',
              
              // Тени
              'shadow-light-sm focus:shadow-light-md dark:shadow-dark-sm dark:focus:shadow-dark-md',
              
              // Hover
              'hover:border-border-secondary',
              
              // Если есть иконка, добавить padding слева
              icon && 'pl-10',
              
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm flex items-center gap-1 text-status-error">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea компонент
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            // Базовые стили
            'w-full px-4 py-2 rounded-lg',
            'transition-all duration-200',
            'resize-none',
            
            // Цвета - автоматически меняются по теме
            'bg-bg-secondary',
            'text-text-primary',
            'placeholder-text-muted',
            
            // Границы
            error 
              ? 'border-2 border-status-error'
              : 'border border-border-primary',
            
            // Focus состояние
            'focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent',
            
            // Тени
            'shadow-light-sm focus:shadow-light-md dark:shadow-dark-sm dark:focus:shadow-dark-md',
            
            // Hover
            'hover:border-border-secondary',
            
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm flex items-center gap-1 text-status-error">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';