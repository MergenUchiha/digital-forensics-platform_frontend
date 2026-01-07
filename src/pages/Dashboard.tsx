import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ThreatChart } from '@/components/dashboard/ThreatChart';
import { WorldMap } from '@/components/dashboard/WorldMap';
import { analyticsService } from '@/services/analytics.service';
import { casesService } from '@/services/cases.service';
import { useLanguage } from '@/contexts/LanguageContext';
import { FolderOpen, AlertTriangle, Database, Activity } from 'lucide-react';

export const Dashboard = () => {
  const { t } = useLanguage();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [stats, casesData] = await Promise.all([
          analyticsService.getDashboard(),
          casesService.getAll(),
        ]);
        
        setDashboardStats(stats);
        setCases(casesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        (window as any).showNotification?.({
          type: 'error',
          title: t.common.error,
          message: 'Failed to load dashboard data',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 dark:text-gray-400">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 dark:text-gray-100">{t.dashboard.title}</h1>
        <p className="text-gray-400 dark:text-gray-400 mt-1">{t.dashboard.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.dashboard.totalEvents}
          value={dashboardStats.totalEvents || 0}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title={t.dashboard.criticalAlerts}
          value={dashboardStats.criticalAlerts || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t.dashboard.activeIncidents}
          value={dashboardStats.activeIncidents || 0}
          icon={FolderOpen}
          color="green"
        />
        <StatCard
          title={t.dashboard.threatsBlocked}
          value={dashboardStats.threatsBlocked || 0}
          icon={Database}
          color="purple"
        />
      </div>

      {/* World Map */}
      <WorldMap cases={cases} />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatChart data={[
          { name: 'Data Breach', count: 15, trend: 'up' },
          { name: 'Malware', count: 12, trend: 'stable' },
          { name: 'DDoS', count: 8, trend: 'down' },
          { name: 'Phishing', count: 5, trend: 'up' },
        ]} />
        <ActivityFeed activities={[
          {
            id: '1',
            type: 'case_created',
            title: 'New case created',
            timestamp: new Date().toISOString(),
            user: { name: 'System' },
          },
        ]} />
      </div>
    </div>
  );
};