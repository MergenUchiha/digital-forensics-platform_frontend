import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ThreatChart } from '@/components/dashboard/ThreatChart';
import { WorldMap } from '@/components/dashboard/WorldMap';
import { mockDashboardStats, mockCases } from '@/data/mockData';
import { FolderOpen, AlertTriangle, Database, Activity } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your forensic investigations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={mockDashboardStats.totalCases}
          icon={FolderOpen}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Cases"
          value={mockDashboardStats.activeCases}
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Critical Cases"
          value={mockDashboardStats.criticalCases}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Evidence Collected"
          value={mockDashboardStats.evidenceCollected}
          icon={Database}
          color="purple"
        />
      </div>

      {/* World Map */}
      <WorldMap cases={mockCases} />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatChart data={mockDashboardStats.topThreats} />
        <ActivityFeed activities={mockDashboardStats.recentActivity} />
      </div>
    </div>
  );
};