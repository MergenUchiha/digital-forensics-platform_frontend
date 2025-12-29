import { Evidence } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatBytes, formatDate, truncateHash } from '@/utils/format';
import { FileText, Download, Hash, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EvidenceCardProps {
  evidence: Evidence;
}

const typeColors: Record<string, 'info' | 'success' | 'warning'> = {
  log: 'info',
  network_capture: 'warning',
  disk_image: 'success',
  memory_dump: 'danger',
  file: 'info',
  api_response: 'success',
};

const typeIcons: Record<string, string> = {
  log: '📋',
  network_capture: '🌐',
  disk_image: '💾',
  memory_dump: '🧠',
  file: '📄',
  api_response: '🔌',
};

export const EvidenceCard = ({ evidence }: EvidenceCardProps) => {
  return (
    <Card className="hover:border-cyber-500/50 transition-all duration-200">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-3xl">{typeIcons[evidence.type]}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-100 truncate">
                {evidence.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {evidence.description || 'No description'}
              </p>
            </div>
          </div>
          <Badge variant={typeColors[evidence.type]} className="ml-4">
            {evidence.type.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Hash className="w-4 h-4" />
            <span className="font-mono text-xs">{truncateHash(evidence.hash.sha256)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span>{formatBytes(evidence.size)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(evidence.uploadedAt)}</span>
            </div>
          </div>
        </div>

        {/* Chain of Custody */}
        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Chain of Custody</p>
          <div className="space-y-2">
            {evidence.chainOfCustody.slice(0, 2).map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-400">
                  {entry.action} by {entry.performedBy.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-800">
          <Button variant="secondary" size="sm" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};