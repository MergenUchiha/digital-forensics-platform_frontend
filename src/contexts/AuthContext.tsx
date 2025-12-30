// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to fetch current user:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Login Successful',
        message: `Welcome back, ${response.user.name}!`,
      });
    } catch (error: any) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Login Failed',
        message: error.response?.data?.message || 'Invalid credentials',
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register({ email, password, name });
      setUser(response.user);
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Registration Successful',
        message: `Welcome, ${response.user.name}!`,
      });
    } catch (error: any) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Registration Failed',
        message: error.response?.data?.message || 'Registration failed',
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    
    (window as any).showNotification?.({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};