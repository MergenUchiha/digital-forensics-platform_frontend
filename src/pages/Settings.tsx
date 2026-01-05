import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { User, Lock, Bell } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
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

  // Загружаем данные при монтировании
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }

    // Загружаем настройки уведомлений из localStorage
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log('Saving profile:', profileData);
      
      // Отправляем запрос на backend
      const response = await api.put('/users/me', {
        name: profileData.name,
      });

      console.log('Profile update response:', response.data);

      (window as any).showNotification?.({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
      });
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
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
        title: 'Error',
        message: 'Passwords do not match',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    if (!passwordData.currentPassword) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Please enter your current password',
      });
      return;
    }

    setIsSaving(true);

    try {
      console.log('Updating password...');
      
      // Отправляем запрос на backend
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      console.log('Password updated successfully');

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      (window as any).showNotification?.({
        type: 'success',
        title: 'Password Updated',
        message: 'Your password has been successfully updated',
      });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      
      let errorMessage = 'Failed to update password';
      
      if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
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
      // Сохраняем в localStorage (в реальном приложении отправляли бы на backend)
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      
      console.log('Saving notification settings:', notificationSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      (window as any).showNotification?.({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Your notification preferences have been saved',
      });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to save preferences',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
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
                    : 'text-gray-400 hover:bg-gray-800'
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
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <Input
                      type="text"
                      value={user?.role || 'analyst'}
                      disabled
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-400">
                      ℹ️ Your password must be at least 6 characters long. Make sure to remember it!
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="primary" disabled={isSaving}>
                      {isSaving ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive email updates about cases</p>
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

                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Case Updates</p>
                      <p className="text-sm text-gray-400">Get notified when cases are updated</p>
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

                  <div className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Evidence Uploads</p>
                      <p className="text-sm text-gray-400">Notifications for new evidence</p>
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
                      <p className="font-medium text-gray-200">Security Alerts</p>
                      <p className="text-sm text-gray-400">Critical security notifications</p>
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
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};