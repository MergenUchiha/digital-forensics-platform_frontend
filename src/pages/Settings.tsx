import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      (window as any).showNotification?.({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
      });
    } catch (error) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile',
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

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

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
    } catch (error) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to update password',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      (window as any).showNotification?.({
        type: 'success',
        title: 'Preferences Saved',
        message: 'Your notification preferences have been saved',
      });
    } catch (error) {
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
                      Current Password
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
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
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
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500"
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
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500"
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
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500"
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
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyber-500 focus:ring-cyber-500"
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