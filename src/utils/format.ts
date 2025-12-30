import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

const parseDate = (date: string | Date): Date | null => {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }
  
  try {
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const formatDate = (date: string | Date): string => {
  const parsed = parseDate(date);
  if (!parsed) return 'Invalid date';
  
  try {
    return format(parsed, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  const parsed = parseDate(date);
  if (!parsed) return 'Invalid date';
  
  try {
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatNumber = (num: number): string => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncateHash = (hash: string, length: number = 8): string => {
  if (!hash) return 'N/A';
  if (hash.length <= length * 2) return hash;
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
  return colors[severity?.toLowerCase()] || colors.info;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open: 'text-blue-500 bg-blue-500/10',
    in_progress: 'text-yellow-500 bg-yellow-500/10',
    closed: 'text-green-500 bg-green-500/10',
    archived: 'text-gray-500 bg-gray-500/10',
  };
  return colors[status?.toLowerCase()] || colors.open;
};