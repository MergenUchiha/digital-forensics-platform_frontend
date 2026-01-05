import { useEffect, useState, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationProps {
  notification: NotificationData;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
};

export const Notification = ({ notification, onClose }: NotificationProps) => {
  const Icon = icons[notification.type];
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const duration = notification.duration || 5000;
    const interval = 50;
    const decrement = (100 / duration) * interval;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev - decrement;
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Use setTimeout to avoid state update during render
          setTimeout(() => onClose(notification.id), 0);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [notification.id, notification.duration, onClose]);

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose(notification.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`relative w-96 p-4 rounded-lg border ${colors[notification.type]} shadow-xl backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white mb-1">{notification.title}</h4>
          <p className="text-sm text-gray-300">{notification.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-lg overflow-hidden">
        <motion.div
          className="h-full bg-current"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

export const NotificationContainer = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const handleClose = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    // Глобальная функция для добавления уведомлений
    (window as any).showNotification = (data: Omit<NotificationData, 'id'>) => {
      const notification: NotificationData = {
        ...data,
        id: `${Date.now()}-${Math.random()}`,
      };
      setNotifications(prev => [...prev, notification]);
    };

    return () => {
      delete (window as any).showNotification;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="sync">
        {notifications.map(notification => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              notification={notification}
              onClose={handleClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};