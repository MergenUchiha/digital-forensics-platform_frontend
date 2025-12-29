import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-700 text-gray-200',
      success: 'bg-green-500/10 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
      info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
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