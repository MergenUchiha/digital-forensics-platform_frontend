// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, message } = error;

    // Handle network errors
    if (!response) {
      console.error('❌ Network Error:', message);
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
      });

      return Promise.reject(new Error('Network error: Unable to connect to the server'));
    }

    const { status, data } = response;

    // Handle 401 Unauthorized - logout user
    if (status === 401) {
      console.error('❌ Unauthorized - Logging out');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }

      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 403 Forbidden
    if (status === 403) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
      });

      return Promise.reject(new Error('Access denied'));
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.error('❌ Not Found:', response.config.url);
      return Promise.reject(new Error(data.message || 'Resource not found'));
    }

    // Handle 409 Conflict
    if (status === 409) {
      return Promise.reject(new Error(data.message || 'Conflict error'));
    }

    // Handle 422 Validation Error
    if (status === 422 || status === 400) {
      const validationErrors = data.errors || [];
      const errorMessage = validationErrors.length > 0
        ? validationErrors.map((e: any) => `${e.field}: ${e.message}`).join(', ')
        : data.message || 'Validation error';

      console.error('❌ Validation Error:', validationErrors);
      return Promise.reject(new Error(errorMessage));
    }

    // Handle 500 Server Error
    if (status >= 500) {
      console.error('❌ Server Error:', data);
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Server Error',
        message: 'An unexpected error occurred on the server. Please try again later.',
      });

      return Promise.reject(new Error('Server error'));
    }

    // Default error handling
    const errorMessage = data.message || 'An unexpected error occurred';
    console.error('❌ API Error:', {
      status,
      message: errorMessage,
      data,
    });

    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function for handling API errors in components
export const handleApiError = (error: any, context?: string): string => {
  const prefix = context ? `${context}: ` : '';

  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    
    if (data.errors && Array.isArray(data.errors)) {
      return prefix + data.errors.map((e: any) => e.message).join(', ');
    }

    if (data.message) {
      return prefix + data.message;
    }

    return prefix + `Server error (${status})`;
  }

  if (error.request) {
    // Request was made but no response
    return prefix + 'Network error: Unable to reach server';
  }

  // Something else happened
  return prefix + (error.message || 'An unexpected error occurred');
};

// Typed API helpers
export const apiHelpers = {
  /**
   * GET request with type safety
   */
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await api.get<T>(url, config);
    return data;
  },

  /**
   * POST request with type safety
   */
  post: async <T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await api.post<T>(url, payload, config);
    return data;
  },

  /**
   * PUT request with type safety
   */
  put: async <T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await api.put<T>(url, payload, config);
    return data;
  },

  /**
   * PATCH request with type safety
   */
  patch: async <T = any>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await api.patch<T>(url, payload, config);
    return data;
  },

  /**
   * DELETE request with type safety
   */
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const { data } = await api.delete<T>(url, config);
    return data;
  },
};