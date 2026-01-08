import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: cn(
        'bg-bg-tertiary text-text-primary border border-border-primary',
      ),
      success: cn(
        'bg-status-success/20 text-status-success border border-status-success/30',
      ),
      warning: cn(
        'bg-status-warning/20 text-status-warning border border-status-warning/30',
      ),
      danger: cn(
        'bg-status-error/20 text-status-error border border-status-error/30',
      ),
      info: cn(
        'bg-status-info/20 text-status-info border border-status-info/30',
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