import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Account not found. Please check your email or register a new account.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ general: errorMessage });

      (window as any).showNotification?.({
        type: 'error',
        title: t.auth.loginFailed,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      'bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary',
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-400 to-cyber-600 rounded-2xl mb-4 shadow-glow-cyan-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">{t.app.title}</h1>
          <p className="text-text-tertiary">{t.app.subtitle}</p>
        </div>

        {/* Login Form */}
        <div className={cn(
          'rounded-2xl p-8',
          'bg-bg-secondary border border-border-primary',
          'shadow-light-xl dark:shadow-dark-xl',
        )}>
          <h2 className="text-2xl font-bold text-text-primary mb-6">{t.auth.login}</h2>

          {/* General Error Message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-status-error/10 border border-status-error/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-status-error mb-1">{t.auth.loginFailed}</p>
                    <p className="text-sm text-status-error/80">{errors.general}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.auth.email}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined, general: undefined }));
                }}
                placeholder="analyst@forensics.io"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.auth.password}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                }}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                error={errors.password}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={isLoading}
              loading={isLoading}
            >
              {t.auth.login}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-text-tertiary text-sm">
              {t.auth.dontHaveAccount}{' '}
              <Link
                to="/register"
                className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors"
              >
                {t.auth.register}
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-status-info/10 border border-status-info/30 rounded-lg p-4">
            <p className="text-status-info text-sm font-medium mb-2">{t.auth.demoCredentials}</p>
            <div className="space-y-1 text-xs text-text-tertiary">
              <p><span className="text-text-muted">Email:</span> analyst@forensics.io</p>
              <p><span className="text-text-muted">Password:</span> demo123</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};