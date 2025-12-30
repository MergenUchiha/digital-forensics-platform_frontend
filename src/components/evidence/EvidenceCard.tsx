import { EvidenceItem } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatBytes, formatDate, truncateHash } from '@/utils/format';
import { FileText, Download, Hash, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EvidenceCardProps {
  evidence: EvidenceItem;
}

const typeColors: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  LOG: 'info',
  NETWORK_CAPTURE: 'warning',
  DISK_IMAGE: 'success',
  MEMORY_DUMP: 'danger',
  FILE: 'info',
  API_RESPONSE: 'success',
};

const typeIcons: Record<string, string> = {
  LOG: '📋',
  NETWORK_CAPTURE: '🌐',
  DISK_IMAGE: '💾',
  MEMORY_DUMP: '🧠',
  FILE: '📄',
  API_RESPONSE: '🔌',
};

export const EvidenceCard = ({ evidence }: EvidenceCardProps) => {
  // Безопасное получение данных с fallback значениями
  const sha256 = evidence.sha256Hash || evidence.hash?.sha256 || 'N/A';
  const md5 = evidence.md5Hash || evidence.hash?.md5 || 'N/A';
  const size = evidence.fileSize || evidence.size || 0;
  const uploadedAt = evidence.uploadedAt || new Date().toISOString();
  const type = evidence.type?.toUpperCase() || 'FILE';

  return (
    <Card className="hover:border-cyber-500/50 transition-all duration-200">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-3xl">{typeIcons[type] || '📄'}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-100 truncate">
                {evidence.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {evidence.description || 'No description'}
              </p>
            </div>
          </div>
          <Badge variant={typeColors[type] || 'info'} className="ml-4">
            {type.replace('_', ' ')}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm">
          {sha256 !== 'N/A' && (
            <div className="flex items-center gap-2 text-gray-400">
              <Hash className="w-4 h-4 flex-shrink-0" />
              <span className="font-mono text-xs truncate">{truncateHash(sha256)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span>{formatBytes(size)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{formatDate(uploadedAt)}</span>
            </div>
          </div>
        </div>

        {/* Chain of Custody */}
        {evidence.chainOfCustody && evidence.chainOfCustody.length > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Chain of Custody</p>
            <div className="space-y-2">
              {evidence.chainOfCustody.slice(0, 2).map((entry) => (
                <div key={entry.id} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-400 truncate">
                    {entry.action.replace('_', ' ')} by {entry.performedBy?.name || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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