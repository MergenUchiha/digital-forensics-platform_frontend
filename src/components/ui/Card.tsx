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
          
          // Фон и границы - автоматически меняются по теме
          'bg-bg-secondary',
          'border border-border-primary',
          
          // Тени - разные для светлой и темной темы
          'shadow-light-lg dark:shadow-dark-lg',
          
          // Hover эффекты (если hoverable)
          hoverable && [
            'hover:shadow-light-xl dark:hover:shadow-dark-xl',
            'hover:border-border-secondary',
            'hover-lift cursor-pointer',
          ],
          
          // Glow эффект для темной темы
          glow && 'dark:shadow-glow-cyan dark:border-cyber-500/30',
          
          // Elevated вариант
          elevated && 'shadow-light-xl dark:shadow-dark-xl',
          
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
        'border-b border-border-primary',
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
        'text-text-primary',
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
        'text-text-secondary',
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
        'border-t border-border-primary',
        className
      )} 
      {...props} 
    />
  )
);

CardFooter.displayName = 'CardFooter';