import { TimelineEvent } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';
import { Shield, Network, FileText, Bell, Lock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<string, any> = {
  AUTHENTICATION: Lock,
  NETWORK: Network,
  FILE_ACCESS: FileText,
  SYSTEM: Activity,
  API_CALL: Shield,
  ALERT: Bell,
};

const severityVariants: Record<string, 'info' | 'warning' | 'danger'> = {
  LOW: 'info',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
  INFO: 'info',
  WARNING: 'warning',
};

export const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const eventType = event.type?.toUpperCase() || 'SYSTEM';
        const Icon = eventIcons[eventType] || Activity;
        const severity = event.severity?.toUpperCase() || 'INFO';
        const variant = severityVariants[severity] || 'info';
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {/* Connecting line */}
            {index !== events.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-800" />
            )}

            <div className="flex gap-4">
              {/* Icon */}
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  severity === 'CRITICAL' 
                    ? 'bg-red-500/10 text-red-400' 
                    : severity === 'HIGH' || severity === 'WARNING'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Content */}
              <Card className="flex-1">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-semibold text-gray-100">
                          {event.title}
                        </h4>
                        <Badge variant={variant}>
                          {severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span>⏰ {formatDate(event.timestamp)}</span>
                    <span>📍 {event.source}</span>
                    {event.ipAddresses && event.ipAddresses.length > 0 && (
                      <span>🌐 {event.ipAddresses[0]}</span>
                    )}
                  </div>

                  {/* Additional metadata if available */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <details className="text-xs">
                        <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                          View metadata
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-900 rounded text-gray-400 overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};