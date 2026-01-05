import { useState } from 'react';
import { EvidenceItem } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Безопасное получение данных с fallback значениями
  const sha256 = evidence.sha256Hash || evidence.hash?.sha256 || 'N/A';
  const md5 = evidence.md5Hash || evidence.hash?.md5 || 'N/A';
  const size = evidence.fileSize || evidence.size || 0;
  const uploadedAt = evidence.uploadedAt || new Date().toISOString();
  const type = evidence.type?.toUpperCase() || 'FILE';

  const handleDownload = () => {
    // Simulate download
    (window as any).showNotification?.({
      type: 'info',
      title: 'Download Started',
      message: `Downloading ${evidence.name}...`,
    });
    
    // In a real app, this would trigger actual file download
    setTimeout(() => {
      (window as any).showNotification?.({
        type: 'success',
        title: 'Download Complete',
        message: `${evidence.name} has been downloaded`,
      });
    }, 1000);
  };

  return (
    <>
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
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsDetailsModalOpen(true)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Evidence Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {evidence.name}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Type</p>
                <Badge variant={typeColors[type] || 'info'}>
                  {type.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Size</p>
                <p className="text-gray-200">{formatBytes(size)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Uploaded</p>
                <p className="text-gray-200">{formatDate(uploadedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Uploaded By</p>
                <p className="text-gray-200">{evidence.uploadedBy?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {evidence.description && (
            <div>
              <p className="text-gray-500 mb-2">Description</p>
              <p className="text-gray-200">{evidence.description}</p>
            </div>
          )}

          {/* Hashes */}
          <div>
            <p className="text-gray-500 mb-2">File Hashes</p>
            <div className="space-y-2 font-mono text-xs">
              {sha256 !== 'N/A' && (
                <div className="p-2 bg-gray-900 rounded">
                  <span className="text-gray-500">SHA-256:</span>
                  <p className="text-gray-200 break-all mt-1">{sha256}</p>
                </div>
              )}
              {md5 !== 'N/A' && (
                <div className="p-2 bg-gray-900 rounded">
                  <span className="text-gray-500">MD5:</span>
                  <p className="text-gray-200 break-all mt-1">{md5}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chain of Custody */}
          {evidence.chainOfCustody && evidence.chainOfCustody.length > 0 && (
            <div>
              <p className="text-gray-500 mb-3">Chain of Custody</p>
              <div className="space-y-3">
                {evidence.chainOfCustody.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="p-3 bg-gray-900 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-200">
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      By {entry.performedBy?.name || 'Unknown'}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-gray-500 mt-2">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
            <div>
              <p className="text-gray-500 mb-2">Metadata</p>
              <pre className="p-4 bg-gray-900 rounded text-xs text-gray-400 overflow-x-auto">
                {JSON.stringify(evidence.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Button 
              variant="primary" 
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download Evidence
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsDetailsModalOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};