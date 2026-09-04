import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { analyticsService } from "@/services/analytics.service";
import { timelineService } from "@/services/timeline.service";
import type { DashboardStats, SeverityCount, TimelineEvent } from "@/types";
import { handleApiError } from "@/services/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { FolderOpen, AlertTriangle, Database, Activity } from "lucide-react";

export const Dashboard = () => {
  const { t } = useLanguage();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [severity, setSeverity] = useState<SeverityCount[]>([]);
  const [recentEvents, setRecentEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, severityCounts, events] = await Promise.all([
          analyticsService.getDashboard(),
          analyticsService.getSeverityDistribution(),
          timelineService.getAll(),
        ]);
        setDashboardStats(stats);
        setSeverity(severityCounts);
        setRecentEvents(events.slice(0, 8));
      } catch (error) {
        window.showNotification?.({
          type: "error",
          title: t.common.error,
          message: handleApiError(error) || t.messages.operationFailed,
        });
      } finally {
        setIsLoading(false);
      }
    };
    void fetchDashboardData();
    // `t` is only read inside the error branch; refetching on a language
    // change would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Real timeline events. This used to fall back to one invented entry
  // reading "New case created" whenever the API returned nothing.
  const activities = recentEvents.map((event) => ({
    id: event.id,
    type: "case_created" as const,
    title: event.title,
    timestamp: event.timestamp,
    user: { name: event.source },
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
          value={dashboardStats.eventsAnalyzed}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title={t.dashboard.criticalAlerts}
          value={dashboardStats.suspiciousEvents}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title={t.dashboard.activeIncidents}
          value={dashboardStats.activeCases}
          icon={FolderOpen}
          color="green"
        />
        <StatCard
          title={t.dashboard.evidenceCollected}
          value={dashboardStats.evidenceCollected}
          icon={Database}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Counted from the timeline. The four bars used to be literals —
            "Data Breach 15, Malware 12, DDoS 8, Phishing 5" — regardless of
            what was in the database. */}
        <ThreatChart
          data={severity.map((item) => ({
            name: item.severity,
            count: item.count,
            trend: "stable" as const,
          }))}
        />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};
