import { Case } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime, getStatusColor } from '@/utils/format';
import { MapPin, Database, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CaseCardProps {
  case: Case;
}

const severityColors = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'success',
} as const;

export const CaseCard = ({ case: c }: CaseCardProps) => {
  const navigate = useNavigate();

  // Безопасное получение статистики
  const evidenceCount = c.evidenceCount || 0;
  const suspiciousActivities = c.suspiciousActivities || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:border-cyber-500/50 transition-all duration-200"
        onClick={() => navigate(`/cases/${c.id}`)}
      >
        <CardContent className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-100 mb-1 truncate">
                {c.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{c.description}</p>
            </div>
            <Badge variant={severityColors[c.severity]} className="ml-4">
              {c.severity.toUpperCase()}
            </Badge>
          </div>

          {/* Tags */}
          {c.tags && c.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {c.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
              {c.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                  +{c.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Database className="w-4 h-4" />
              <span>{evidenceCount} evidence</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Activity className="w-4 h-4" />
              <span>{suspiciousActivities} alerts</span>
            </div>
            {c.locationCity && c.locationCountry && (
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{c.locationCity}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {c.createdBy?.name ? c.createdBy.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  {c.assignedTo?.name || 'Unassigned'}
                </p>
                <p className="text-xs text-gray-500">{formatRelativeTime(c.updatedAt)}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
              {c.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};