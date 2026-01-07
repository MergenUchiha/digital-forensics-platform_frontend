// src/components/ui/Badge.tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: cn(
        // Dark theme
        'dark:bg-dark-bg-tertiary dark:text-dark-text-primary',
        // Light theme
        'bg-light-bg-tertiary text-light-text-primary',
      ),
      success: cn(
        // Dark theme
        'dark:bg-status-success-dark/20 dark:text-status-success-dark',
        'dark:border dark:border-status-success-dark/30',
        // Light theme
        'bg-status-success-light/10 text-status-success-light',
        'border border-status-success-light/30',
      ),
      warning: cn(
        // Dark theme
        'dark:bg-status-warning-dark/20 dark:text-status-warning-dark',
        'dark:border dark:border-status-warning-dark/30',
        // Light theme
        'bg-status-warning-light/10 text-status-warning-light',
        'border border-status-warning-light/30',
      ),
      danger: cn(
        // Dark theme
        'dark:bg-status-error-dark/20 dark:text-status-error-dark',
        'dark:border dark:border-status-error-dark/30',
        // Light theme
        'bg-status-error-light/10 text-status-error-light',
        'border border-status-error-light/30',
      ),
      info: cn(
        // Dark theme
        'dark:bg-status-info-dark/20 dark:text-status-info-dark',
        'dark:border dark:border-status-info-dark/30',
        // Light theme
        'bg-status-info-light/10 text-status-info-light',
        'border border-status-info-light/30',
      ),
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          'transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';