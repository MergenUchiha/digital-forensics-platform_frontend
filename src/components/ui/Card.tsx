// src/components/ui/Card.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  elevated?: boolean;
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, elevated = false, hoverable = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Базовые стили
          'rounded-xl p-6 transition-all duration-300',
          
          // Dark theme
          'dark:bg-dark-bg-secondary',
          'dark:border dark:border-dark-border-primary',
          'dark:shadow-dark-lg',
          
          // Light theme
          'bg-light-bg-secondary',
          'border border-light-border-primary',
          'shadow-light-lg',
          
          // Hover эффекты (если hoverable)
          hoverable && [
            // Dark
            'dark:hover:shadow-dark-xl',
            'dark:hover:border-dark-border-secondary',
            // Light
            'hover:shadow-light-xl',
            'hover:border-light-border-secondary',
            // Common
            'hover-lift cursor-pointer',
          ],
          
          // Glow эффект для темной темы
          glow && 'dark:shadow-glow-cyan dark:border-dark-border-glow',
          
          // Elevated вариант
          elevated && 'dark:bg-dark-bg-elevated',
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'mb-4 pb-4',
        // Dark theme
        'dark:border-b dark:border-dark-border-primary',
        // Light theme
        'border-b border-light-border-primary',
        className
      )} 
      {...props} 
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 
      ref={ref} 
      className={cn(
        'text-xl font-semibold',
        // Dark theme
        'dark:text-dark-text-primary',
        // Light theme
        'text-light-text-primary',
        className
      )} 
      {...props} 
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        // Dark theme
        'dark:text-dark-text-secondary',
        // Light theme
        'text-light-text-secondary',
        className
      )} 
      {...props} 
    />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'mt-4 pt-4',
        // Dark theme
        'dark:border-t dark:border-dark-border-primary',
        // Light theme
        'border-t border-light-border-primary',
        className
      )} 
      {...props} 
    />
  )
);

CardFooter.displayName = 'CardFooter';