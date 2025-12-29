import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncateHash = (hash: string, length: number = 8): string => {
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
};

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-blue-500',
    info: 'text-gray-500',
  };
  return colors[severity] || colors.info;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open: 'text-blue-500 bg-blue-500/10',
    in_progress: 'text-yellow-500 bg-yellow-500/10',
    closed: 'text-green-500 bg-green-500/10',
    archived: 'text-gray-500 bg-gray-500/10',
  };
  return colors[status] || colors.open;
};