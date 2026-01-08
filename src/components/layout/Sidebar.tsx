import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Database, 
  Clock, 
  Network, 
  FileText,
  Settings,
  Shield,
  LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, path: '/' },
    { icon: FolderOpen, label: t.nav.cases, path: '/cases' },
    { icon: Database, label: t.nav.evidence, path: '/evidence' },
    { icon: Clock, label: t.nav.timeline, path: '/timeline' },
    { icon: Network, label: t.nav.network, path: '/network' },
    { icon: FileText, label: t.nav.reports, path: '/reports' },
    { icon: Settings, label: t.nav.settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border-primary flex flex-col shadow-light-xl dark:shadow-dark-xl">
      {/* Logo */}
      <div className="p-6 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyber-400 to-cyber-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">{t.app.title}</h1>
            <p className="text-xs text-text-tertiary">{t.app.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-cyber-500/10 text-cyber-400 border border-cyber-500/30' 
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-primary">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-text-tertiary capitalize">
              {user?.role || 'Analyst'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-status-error hover:bg-status-error/10 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
};