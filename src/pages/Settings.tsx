import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/services/api';
import { User, Lock, Bell, Palette } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    caseUpdates: true,
    evidenceUploads: true,
    securityAlerts: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }

    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, [user]);

  const tabs = [
    { id: 'profile' as const, label: t.settings.profile, icon: User },
    { id: 'security' as const, label: t.settings.security, icon: Lock },
    { id: 'notifications' as const, label: t.settings.notifications, icon: Bell },
    { id: 'appearance' as const, label: t.settings.appearance, icon: Palette },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.put('/users/me', {
        name: profileData.name,
      });

      (window as any).showNotification?.({
        type: 'success',
        title: t.settings.profileUpdated,
        message: t.settings.profileUpdated,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t.common.error;
      
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: t.settings.passwordMismatch,
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: t.settings.passwordTooShort,
      });
      return;
    }

    if (!passwordData.currentPassword) {
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: 'Please enter your current password',
      });
      return;
    }

    setIsSaving(true);

    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      (window as any).showNotification?.({
        type: 'success',
        title: t.settings.passwordUpdated,
        message: t.settings.passwordUpdated,
      });
    } catch (error: any) {
      let errorMessage = t.common.error;
      
      if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      await new Promise(resolve => setTimeout(resolve, 500));

      (window as any).showNotification?.({
        type: 'success',
        title: t.settings.preferencesSaved,
        message: t.settings.preferencesSaved,
      });
    } catch (error) {
      (window as any).showNotification?.({
        type: 'error',
        title: t.common.error,
        message: t.common.error,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    (window as any).showNotification?.({
      type: 'success',
      title: t.common.success,
      message: `Theme changed to ${newTheme}`,
    });
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ru' | 'tk') => {
    setLanguage(newLanguage);
    (window as any).showNotification?.({
      type: 'success',
      title: t.common.success,
      message: `Language changed`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-100">{t.settings.title}</h1>
        <p className="text-gray-400 dark:text-gray-400 mt-1">{t.settings.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-cyber-500/10 text-cyber-400 border border-cyber-500/30' 
                    : 'text-gray-400 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.profileInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.settings.fullName}
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder={t.settings.fullName}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.auth.email}
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      placeholder={t.auth.email}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.settings.emailCannotChange}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.settings.role}
                    </label>
                    <Input
                      type="text"
                      value={user?.role || 'analyst'}
                      disabled
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? `${t.common.loading}` : t.settings.saveChanges}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.securitySettings}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.settings.currentPassword} *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder={t.settings.currentPassword}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.settings.newPassword} *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder={t.settings.newPassword}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                      {t.settings.confirmNewPassword} *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder={t.settings.confirmNewPassword}
                      required
                    />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-400">
                      ℹ️ {t.settings.passwordTooShort}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? `${t.common.loading}` : t.settings.updatePassword}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.notificationPreferences}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-800 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.emailNotifications}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-400">{t.settings.emailNotificationsDesc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailNotifications: e.target.checked 
                      })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-800 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.caseUpdates}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-400">{t.settings.caseUpdatesDesc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.caseUpdates}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        caseUpdates: e.target.checked 
                      })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-800 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.evidenceUploads}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-400">{t.settings.evidenceUploadsDesc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.evidenceUploads}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        evidenceUploads: e.target.checked 
                      })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.securityAlerts}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-400">{t.settings.securityAlertsDesc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.securityAlerts}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        securityAlerts: e.target.checked 
                      })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500 cursor-pointer"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? `${t.common.loading}` : t.common.save}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.appearanceSettings}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                    {t.settings.theme}
                  </label>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-3">{t.settings.themeDesc}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-cyber-500 bg-cyber-500/10'
                          : 'border-gray-700 dark:border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded" />
                        <span className="text-sm font-medium text-gray-200 dark:text-gray-200">
                          {t.settings.lightTheme}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-cyber-500 bg-cyber-500/10'
                          : 'border-gray-700 dark:border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-950 rounded" />
                        <span className="text-sm font-medium text-gray-200 dark:text-gray-200">
                          {t.settings.darkTheme}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                    {t.settings.language}
                  </label>
                  <p className="text-sm text-gray-400 dark:text-gray-400 mb-3">{t.settings.languageDesc}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        language === 'en'
                          ? 'border-cyber-500 bg-cyber-500/10'
                          : 'border-gray-700 dark:border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇬🇧</span>
                        <div>
                          <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.english}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-400">English</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleLanguageChange('ru')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        language === 'ru'
                          ? 'border-cyber-500 bg-cyber-500/10'
                          : 'border-gray-700 dark:border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇷🇺</span>
                        <div>
                          <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.russian}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-400">Русский</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleLanguageChange('tk')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        language === 'tk'
                          ? 'border-cyber-500 bg-cyber-500/10'
                          : 'border-gray-700 dark:border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇹🇲</span>
                        <div>
                          <p className="font-medium text-gray-200 dark:text-gray-200">{t.settings.turkmen}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-400">Türkmençe</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};