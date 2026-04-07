import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { analyticsService } from "@/services/analytics.service";
import { useLanguage } from "@/contexts/LanguageContext";
import { FolderOpen, AlertTriangle, Database, Activity } from "lucide-react";

export const Dashboard = () => {
  const { t } = useLanguage();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const stats = await analyticsService.getDashboard();
        setDashboardStats(stats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        (window as any).showNotification?.({
          type: "error",
          title: t.common.error,
          message: t.messages.operationFailed,
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
          <p className="text-text-secondary">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">{t.messages.noData}</p>
      </div>
    );
  }

  // Translated activity titles
  const translatedActivities = (
    dashboardStats.recentActivity || [
      {
        id: "1",
        type: "case_created",
        title: t.dashboard.newCaseCreated,
        timestamp: new Date().toISOString(),
        user: { name: "System" },
      },
    ]
  ).map((a: any) => ({
    ...a,
    title:
      a.type === "case_created"
        ? t.dashboard.newCaseCreated
        : a.type === "evidence_uploaded"
          ? t.dashboard.evidenceUploaded
          : a.type === "analysis_completed"
            ? t.dashboard.analysisCompleted
            : a.title,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t.dashboard.title}
          </h1>
          <p className="text-text-secondary mt-1">{t.dashboard.subtitle}</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatChart
          data={[
            { name: "Data Breach", count: 15, trend: "up" },
            { name: "Malware", count: 12, trend: "stable" },
            { name: "DDoS", count: 8, trend: "down" },
            { name: "Phishing", count: 5, trend: "up" },
          ]}
        />
        <ActivityFeed activities={translatedActivities} />
      </div>
    </div>
  );
};
