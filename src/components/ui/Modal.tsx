// src/components/ui/Modal.tsx
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn(
              'fixed inset-0 backdrop-blur-sm z-50',
              'dark:bg-black/60',
              'bg-black/40'
            )}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                `relative w-full ${sizes[size]} rounded-xl shadow-2xl my-8`,
                // Dark theme
                'dark:bg-dark-bg-secondary dark:border dark:border-dark-border-primary',
                'dark:shadow-dark-2xl',
                // Light theme
                'bg-light-bg-secondary border border-light-border-primary',
                'shadow-light-2xl',
              )}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between p-6',
                // Dark theme
                'dark:border-b dark:border-dark-border-primary',
                // Light theme
                'border-b border-light-border-primary',
              )}>
                <h3 className={cn(
                  'text-xl font-semibold',
                  // Dark theme
                  'dark:text-dark-text-primary',
                  // Light theme
                  'text-light-text-primary',
                )}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    // Dark theme
                    'dark:text-dark-text-muted dark:hover:text-white dark:hover:bg-dark-bg-hover',
                    // Light theme
                    'text-light-text-muted hover:text-light-text-primary hover:bg-light-bg-hover',
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};