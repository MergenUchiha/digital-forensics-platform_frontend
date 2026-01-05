import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Timeline } from '@/components/timeline/Timeline';
import { EvidenceCard } from '@/components/evidence/EvidenceCard';
import { Case, EvidenceItem, TimelineEvent } from '@/types';
import { formatDate, formatRelativeTime, getStatusColor } from '@/utils/format';
import { exportCaseToPDF } from '@/utils/pdfExport';
import { 
  ArrowLeft, 
  MapPin, 
  Activity, 
  Shield,
  AlertTriangle,
  Clock,
  Edit,
  Download,
  Share2,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { casesService } from '@/services/cases.service';
import { evidenceService } from '@/services/evidence.service';
import { timelineService } from '@/services/timeline.service';

export const CaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'timeline' | 'analysis'>('overview');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    status: 'OPEN',
  });

  useEffect(() => {
    if (id) {
      fetchCaseData(id);
    }
  }, [id]);

  const fetchCaseData = async (caseId: string) => {
    try {
      setIsLoading(true);
      const [caseResponse, evidenceResponse, eventsResponse] = await Promise.all([
        casesService.getById(caseId),
        evidenceService.getAll(caseId),
        timelineService.getAll(caseId),
      ]);

      setCaseData(caseResponse);
      setEvidence(evidenceResponse);
      setEvents(eventsResponse);
      
      // Set edit form data с правильным форматом
      setEditFormData({
        title: caseResponse.title,
        description: caseResponse.description,
        severity: caseResponse.severity.toString().toUpperCase(),
        status: caseResponse.status.toString().toUpperCase(),
      });
    } catch (error) {
      console.error('Failed to fetch case data:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to load case details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      // Отправляем данные в правильном формате (уже в верхнем регистре)
      await casesService.update(id, editFormData);
      
      await fetchCaseData(id);
      setIsEditModalOpen(false);
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Case Updated',
        message: 'Case has been successfully updated',
      });
    } catch (error: any) {
      console.error('Failed to update case:', error);
      
      let errorMessage = 'Failed to update case';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map((e: any) => e.message || e).join(', ');
      }
      
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    }
  };

  const handleExportPDF = () => {
    if (caseData) {
      exportCaseToPDF(caseData, evidence, events);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      (window as any).showNotification?.({
        type: 'success',
        title: 'Link Copied',
        message: 'Case link has been copied to clipboard',
      });
    }).catch(() => {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to copy link',
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Case Not Found</h2>
          <p className="text-gray-400 mb-4">The case you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/cases')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Shield },
    { id: 'evidence' as const, label: 'Evidence', icon: Database, badge: evidence.length },
    { id: 'timeline' as const, label: 'Timeline', icon: Clock, badge: events.length },
    { id: 'analysis' as const, label: 'Analysis', icon: Activity },
  ];

  const severityColors: any = {
    critical: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'success',
    CRITICAL: 'danger',
    HIGH: 'warning',
    MEDIUM: 'info',
    LOW: 'success',
  };

  const severity = caseData.severity.toString().toLowerCase();
  const status = caseData.status.toString().toLowerCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/cases')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                {caseData.title}
              </h1>
              <p className="text-gray-400">{caseData.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant={severityColors[severity]}>
                {severity.toUpperCase()}
              </Badge>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="primary" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
          <Edit className="w-4 h-4" />
          Edit Case
        </Button>
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={handleExportPDF}
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
        <Button variant="secondary" className="gap-2" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Evidence Collected</p>
              <p className="text-2xl font-bold text-gray-100">{evidence.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Events Logged</p>
              <p className="text-2xl font-bold text-gray-100">{events.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Suspicious Activities</p>
              <p className="text-2xl font-bold text-gray-100">
                {events.filter(e => {
                  const sev = e.severity.toString().toUpperCase();
                  return sev === 'CRITICAL' || sev === 'HIGH';
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Time Elapsed</p>
              <p className="text-2xl font-bold text-gray-100">
                {Math.floor((Date.now() - new Date(caseData.createdAt).getTime()) / (1000 * 60 * 60))}h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-medium transition-all relative
                  ${isActive 
                    ? 'text-cyber-400 border-b-2 border-cyber-400' 
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {'badge' in tab && tab.badge !== undefined && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Case ID</p>
                      <p className="text-gray-100 font-mono">{caseData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created</p>
                      <p className="text-gray-100">{formatDate(caseData.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="text-gray-100">{formatRelativeTime(caseData.updatedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                      <p className="text-gray-100">{caseData.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                  </div>

                  {(caseData.location || (caseData.locationCity && caseData.locationCountry)) && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </p>
                      <p className="text-gray-100">
                        {caseData.location 
                          ? `${caseData.location.city}, ${caseData.location.country}`
                          : `${caseData.locationCity}, ${caseData.locationCountry}`
                        }
                      </p>
                    </div>
                  )}

                  {caseData.tags && caseData.tags.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {caseData.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {caseData.createdBy.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-100">{caseData.createdBy.name}</p>
                      <p className="text-xs text-gray-500">Case Creator</p>
                    </div>
                  </div>
                  
                  {caseData.assignedTo && (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {caseData.assignedTo.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">{caseData.assignedTo.name}</p>
                        <p className="text-xs text-gray-500">Assigned Analyst</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">
                Evidence Collection ({evidence.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evidence.map(ev => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>

            {evidence.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No evidence collected yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">
                Event Timeline ({events.length})
              </h2>
            </div>
            
            <Timeline events={events} />

            {events.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No events logged yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Critical Findings</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• {events.filter(e => {
                        const sev = e.severity.toString().toUpperCase();
                        return sev === 'CRITICAL' || sev === 'HIGH';
                      }).length} critical/high security events detected</li>
                      <li>• {evidence.length} pieces of evidence collected</li>
                      <li>• Investigation ongoing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Case"
        size="lg"
      >
        <form onSubmit={handleEditCase} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Case Title *
            </label>
            <Input
              type="text"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Severity *
              </label>
              <select
                value={editFormData.severity}
                onChange={(e) => setEditFormData({ ...editFormData, severity: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};