import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatRelativeTime } from '@/utils/format';
import { FolderOpen, Upload, CheckCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'case_created' | 'evidence_uploaded' | 'analysis_completed';
  title: string;
  timestamp: string;
  user: {
    name: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
}

const getIcon = (type: Activity['type']) => {
  const icons = {
    case_created: FolderOpen,
    evidence_uploaded: Upload,
    analysis_completed: CheckCircle,
  };
  return icons[type];
};

const getColor = (type: Activity['type']) => {
  const colors = {
    case_created: 'text-blue-500 bg-blue-500/10',
    evidence_uploaded: 'text-green-500 bg-green-500/10',
    analysis_completed: 'text-purple-500 bg-purple-500/10',
  };
  return colors[type];
};

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);
            
            return (
              <div key={activity.id} className="flex gap-4">
                <div className={`p-2 rounded-lg ${colorClass} h-fit`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium">{activity.title}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {activity.user.name} · {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};