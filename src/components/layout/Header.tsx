import { useState, useEffect } from 'react';
import { Bell, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { CreateCaseModal } from '@/components/cases/CreateCaseModal';
import { casesService } from '@/services/cases.service';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime } from '@/utils/format';
import { api } from '@/services/api';
import { cn } from '@/utils/cn';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export const Header = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isNotificationsOpen) {
      fetchNotifications();
    }
  }, [isNotificationsOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      setNotifications([
        {
          id: '1',
          title: 'Welcome to ForensicsLab',
          message: 'Start by creating your first case',
          createdAt: new Date().toISOString(),
          read: false,
          type: 'info',
        },
      ]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCreateCase = async (data: any) => {
    try {
      const newCase = await casesService.create(data);
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Case Created',
        message: `Case "${data.title}" has been successfully created`,
      });
      
      fetchNotifications();
      navigate(`/cases/${newCase.id}`);
    } catch (error: any) {
      console.error('Failed to create case:', error);
      
      let errorMessage = 'Failed to create case';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map((e: any) => e.message || e).join(', ');
        }
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      
      throw error;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <>
      <header className="h-16 bg-bg-secondary border-b border-border-primary flex items-center justify-between px-6 shadow-light-md dark:shadow-dark-md">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <SearchBar placeholder="Search cases, evidence, events..." />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications Button */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {unreadCount}
                </motion.span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute right-0 top-full mt-2 w-96 rounded-lg shadow-2xl z-50 overflow-hidden',
                      'bg-bg-secondary border border-border-primary',
                    )}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-border-primary flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                        {unreadCount > 0 && (
                          <p className="text-xs text-text-tertiary mt-0.5">
                            {unreadCount} unread
                          </p>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {isLoadingNotifications ? (
                        <div className="p-8 text-center">
                          <div className="w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-text-tertiary">Loading...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div>
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className={cn(
                                'p-4 border-b border-border-primary cursor-pointer transition-colors',
                                'hover:bg-bg-hover',
                                !notification.read && 'bg-cyan-500/5'
                              )}
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-medium text-text-primary">
                                      {notification.title}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(notification.id);
                                      }}
                                      className="text-text-muted hover:text-text-primary transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-text-tertiary mt-2">
                                    {formatRelativeTime(notification.createdAt)}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-text-muted mx-auto mb-3" />
                          <p className="text-sm text-text-tertiary">No notifications</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border-primary text-center">
                        <button 
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Case
          </Button>
        </div>
      </header>

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </>
  );
};