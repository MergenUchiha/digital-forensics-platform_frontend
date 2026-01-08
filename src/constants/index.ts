/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  RECENT_SEARCHES: 'recentSearches',
  REPORTS: 'forensics_reports',
} as const;

// Case Status
export const CASE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
} as const;

export type CaseStatus = typeof CASE_STATUS[keyof typeof CASE_STATUS];

// Case Severity
export const CASE_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type CaseSeverity = typeof CASE_SEVERITY[keyof typeof CASE_SEVERITY];

// Evidence Types
export const EVIDENCE_TYPES = {
  LOG: 'log',
  NETWORK_CAPTURE: 'network_capture',
  DISK_IMAGE: 'disk_image',
  MEMORY_DUMP: 'memory_dump',
  FILE: 'file',
  API_RESPONSE: 'api_response',
} as const;

export type EvidenceType = typeof EVIDENCE_TYPES[keyof typeof EVIDENCE_TYPES];

// Event Types
export const EVENT_TYPES = {
  AUTHENTICATION: 'authentication',
  NETWORK: 'network',
  FILE_ACCESS: 'file_access',
  SYSTEM: 'system',
  API_CALL: 'api_call',
  ALERT: 'alert',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

// Languages
export const LANGUAGES = {
  EN: 'en',
  RU: 'ru',
  TK: 'tk',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILES: 20,
  ACCEPTED_TYPES: ['*'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  CASES: '/cases',
  CASE_DETAILS: '/cases/:id',
  EVIDENCE: '/evidence',
  TIMELINE: '/timeline',
  NETWORK: '/network',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMM dd, yyyy HH:mm',
  DATE_ONLY: 'MMM dd, yyyy',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// Status Colors
export const STATUS_COLORS = {
  [CASE_STATUS.OPEN]: 'text-blue-500 bg-blue-500/10',
  [CASE_STATUS.IN_PROGRESS]: 'text-yellow-500 bg-yellow-500/10',
  [CASE_STATUS.CLOSED]: 'text-green-500 bg-green-500/10',
  [CASE_STATUS.ARCHIVED]: 'text-gray-500 bg-gray-500/10',
} as const;

// Severity Colors
export const SEVERITY_COLORS = {
  [CASE_SEVERITY.LOW]: 'text-blue-500',
  [CASE_SEVERITY.MEDIUM]: 'text-yellow-500',
  [CASE_SEVERITY.HIGH]: 'text-orange-500',
  [CASE_SEVERITY.CRITICAL]: 'text-red-500',
} as const;

// Badge Variants
export const BADGE_VARIANTS = {
  [CASE_SEVERITY.LOW]: 'success' as const,
  [CASE_SEVERITY.MEDIUM]: 'info' as const,
  [CASE_SEVERITY.HIGH]: 'warning' as const,
  [CASE_SEVERITY.CRITICAL]: 'danger' as const,
} as const;

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/.+/,
} as const;

// API Endpoints (relative to BASE_URL)
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Cases
  CASES: '/cases',
  CASE_BY_ID: (id: string) => `/cases/${id}`,
  
  // Evidence
  EVIDENCE: '/evidence',
  EVIDENCE_BY_ID: (id: string) => `/evidence/${id}`,
  
  // Timeline
  TIMELINE: '/timeline',
  TIMELINE_BY_ID: (id: string) => `/timeline/${id}`,
  
  // Analytics
  DASHBOARD: '/analytics/dashboard',
  TIME_SERIES: '/analytics/time-series',
  
  // Users
  CURRENT_USER: '/users/me',
  USERS: '/users',
  UPDATE_PROFILE: '/users/me',
  CHANGE_PASSWORD: '/users/me/password',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
} as const;