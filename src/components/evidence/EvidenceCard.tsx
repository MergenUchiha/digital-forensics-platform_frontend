import { useState } from 'react';
import { EvidenceItem } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatBytes, formatDate, truncateHash } from '@/utils/format';
import { FileText, Download, Hash, Clock, Cpu, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { evidenceService } from '@/services/evidence.service';

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
  PHOTO: 'warning',
};

const typeIcons: Record<string, string> = {
  LOG: '📋',
  NETWORK_CAPTURE: '🌐',
  DISK_IMAGE: '💾',
  MEMORY_DUMP: '🧠',
  FILE: '📄',
  API_RESPONSE: '🔌',
  PHOTO: '📷',
};

const iotDeviceLabels: Record<string, string> = {
  CAMERA: '📹 Camera',
  SMART_SPEAKER: '🔊 Smart Speaker',
  SENSOR: '📡 Sensor',
  SMART_LOCK: '🔒 Smart Lock',
  ROUTER: '📶 Router',
  DVR: '🎥 DVR',
  SMART_TV: '📺 Smart TV',
  WEARABLE: '⌚ Wearable',
  OTHER: '🔧 Other',
};

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
const textExtensions = ['.txt', '.log', '.csv', '.json', '.xml', '.yaml', '.yml', '.md', '.ini', '.conf'];

function isImageFile(name: string): boolean {
  const lower = name.toLowerCase();
  return imageExtensions.some(ext => lower.endsWith(ext));
}

function isTextFile(name: string, type: string): boolean {
  const lower = name.toLowerCase();
  const upperType = type.toUpperCase();
  return textExtensions.some(ext => lower.endsWith(ext)) || upperType === 'LOG' || upperType === 'API_RESPONSE';
}

export const EvidenceCard = ({ evidence }: EvidenceCardProps) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const sha256 = evidence.sha256Hash || evidence.hash?.sha256 || 'N/A';
  const md5 = evidence.md5Hash || evidence.hash?.md5 || 'N/A';
  const size = evidence.fileSize || evidence.size || 0;
  const uploadedAt = evidence.uploadedAt || evidence.createdAt || new Date().toISOString();
  const type = evidence.type?.toUpperCase() || 'FILE';

  const hasFile = !!(evidence.filePath);
  const fileUrl = hasFile ? evidenceService.getFileUrl(evidence.id) : null;
  const showImage = hasFile && (isImageFile(evidence.name) || type === 'PHOTO');
  const showText = hasFile && isTextFile(evidence.name, type);

  const handleViewDetails = async () => {
    setIsDetailsModalOpen(true);
    if (showText && !textContent) {
      setIsLoadingContent(true);
      try {
        const response = await fetch(fileUrl!, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const text = await response.text();
          setTextContent(text.slice(0, 10000));
        }
      } catch (e) {
        console.error('Failed to load file content:', e);
      } finally {
        setIsLoadingContent(false);
      }
    }
  };

  const handleDownload = async () => {
    if (hasFile && fileUrl) {
      try {
        const response = await fetch(fileUrl, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Download failed');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = evidence.name || 'evidence';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        (window as any).showNotification?.({
          type: 'error',
          title: 'Download Failed',
          message: 'Failed to download the file',
        });
        return;
      }
    } else {
      const fileContent = `Evidence File: ${evidence.name}
Type: ${type}
Description: ${evidence.description || 'No description'}
SHA-256: ${sha256}
MD5: ${md5}
Size: ${formatBytes(size)}
Uploaded: ${formatDate(uploadedAt)}
Uploaded By: ${evidence.uploadedBy?.name || 'Unknown'}`;

      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = evidence.name || 'evidence.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    (window as any).showNotification?.({
      type: 'success',
      title: 'Download Complete',
      message: `${evidence.name} has been downloaded`,
    });
  };

  return (
    <>
      <Card className="hover:border-cyber-500/50 transition-all duration-200">
        <CardContent className="space-y-4">
          {/* Image thumbnail for photo evidence */}
          {showImage && fileUrl && (
            <div className="relative -mx-4 -mt-4 mb-2 overflow-hidden rounded-t-lg">
              <img
                src={fileUrl}
                alt={evidence.name}
                className="w-full h-40 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="text-3xl">{typeIcons[type] || '📄'}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary truncate">
                  {evidence.name}
                </h3>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {evidence.description || 'No description'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4">
              <Badge variant={typeColors[type] || 'info'}>
                {type.replace('_', ' ')}
              </Badge>
              {evidence.iotDeviceType && (
                <Badge variant="warning">
                  {iotDeviceLabels[evidence.iotDeviceType] || evidence.iotDeviceType}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-sm">
            {sha256 !== 'N/A' && (
              <div className="flex items-center gap-2 text-text-tertiary">
                <Hash className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono text-xs truncate">{truncateHash(sha256)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-tertiary">
                <FileText className="w-4 h-4" />
                <span>{formatBytes(size)}</span>
              </div>
              <div className="flex items-center gap-2 text-text-tertiary">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{formatDate(uploadedAt)}</span>
              </div>
            </div>
          </div>

          {/* Chain of Custody */}
          {evidence.chainOfCustody && evidence.chainOfCustody.length > 0 && (
            <div className="pt-4 border-t border-border-primary">
              <p className="text-xs text-text-muted mb-2">Chain of Custody</p>
              <div className="space-y-2">
                {evidence.chainOfCustody.slice(0, 2).map((entry) => (
                  <div key={entry.id} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-status-success rounded-full flex-shrink-0" />
                    <span className="text-text-tertiary truncate">
                      {entry.action.replace('_', ' ')} by {entry.performedBy?.name || 'Unknown'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border-primary">
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
              className="flex-1 gap-2"
              onClick={handleViewDetails}
            >
              <Eye className="w-4 h-4" />
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
          {/* File Preview */}
          {showImage && fileUrl && (
            <div>
              <p className="text-text-muted mb-2">File Preview</p>
              <div className="rounded-lg overflow-hidden border border-border-primary bg-bg-tertiary flex items-center justify-center">
                <img
                  src={fileUrl}
                  alt={evidence.name}
                  className="max-w-full max-h-[400px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {showText && (
            <div>
              <p className="text-text-muted mb-2">File Content</p>
              <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4 max-h-[300px] overflow-auto">
                {isLoadingContent ? (
                  <p className="text-text-secondary text-sm">Loading content...</p>
                ) : textContent ? (
                  <pre className="text-xs text-text-secondary whitespace-pre-wrap break-all font-mono">
                    {textContent}
                  </pre>
                ) : (
                  <p className="text-text-secondary text-sm">Unable to load file content</p>
                )}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {evidence.name}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-muted mb-1">Type</p>
                <Badge variant={typeColors[type] || 'info'}>
                  {type.replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <p className="text-text-muted mb-1">Size</p>
                <p className="text-text-primary">{formatBytes(size)}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Uploaded</p>
                <p className="text-text-primary">{formatDate(uploadedAt)}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1">Uploaded By</p>
                <p className="text-text-primary">{evidence.uploadedBy?.name || 'Unknown'}</p>
              </div>
              {evidence.iotDeviceType && (
                <div className="col-span-2">
                  <p className="text-text-muted mb-1">IoT Device Source</p>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyber-400" />
                    <span className="text-text-primary">
                      {iotDeviceLabels[evidence.iotDeviceType] || evidence.iotDeviceType}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {evidence.description && (
            <div>
              <p className="text-text-muted mb-2">Description</p>
              <p className="text-text-primary">{evidence.description}</p>
            </div>
          )}

          {/* Hashes */}
          <div>
            <p className="text-text-muted mb-2">File Hashes</p>
            <div className="space-y-2 font-mono text-xs">
              {sha256 !== 'N/A' && (
                <div className="p-2 bg-bg-tertiary rounded">
                  <span className="text-text-muted">SHA-256:</span>
                  <p className="text-text-primary break-all mt-1">{sha256}</p>
                </div>
              )}
              {md5 !== 'N/A' && (
                <div className="p-2 bg-bg-tertiary rounded">
                  <span className="text-text-muted">MD5:</span>
                  <p className="text-text-primary break-all mt-1">{md5}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chain of Custody */}
          {evidence.chainOfCustody && evidence.chainOfCustody.length > 0 && (
            <div>
              <p className="text-text-muted mb-3">Chain of Custody</p>
              <div className="space-y-3">
                {evidence.chainOfCustody.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-bg-tertiary rounded-lg border border-border-primary"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      By {entry.performedBy?.name || 'Unknown'}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-text-muted mt-2">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
            <div>
              <p className="text-text-muted mb-2">Metadata</p>
              <pre className="p-4 bg-bg-tertiary rounded text-xs text-text-secondary overflow-x-auto">
                {JSON.stringify(evidence.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border-primary">
            <Button
              variant="primary"
              className="flex-1 gap-2"
              onClick={() => {
                handleDownload();
                setIsDetailsModalOpen(false);
              }}
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
