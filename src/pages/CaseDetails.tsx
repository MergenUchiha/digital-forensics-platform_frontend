import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/timeline/Timeline';
import { EvidenceCard } from '@/components/evidence/EvidenceCard';
import { mockCases, mockEvidence, mockTimelineEvents } from '@/data/mockData';
import { formatDate, formatRelativeTime, getStatusColor, getSeverityColor } from '@/utils/format';
import { exportCaseToPDF } from '@/utils/pdfExport';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Activity, 
  FileText,
  Shield,
  AlertTriangle,
  Clock,
  Edit,
  Download,
  Share2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'timeline' | 'analysis'>('overview');

  // Найти дело по ID
  const caseData = mockCases.find(c => c.id === id);
  
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

  const caseEvidence = mockEvidence.filter(e => e.caseId === caseData.id);
  const caseEvents = mockTimelineEvents.filter(e => e.caseId === caseData.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'evidence', label: 'Evidence', icon: Shield, badge: caseEvidence.length },
    { id: 'timeline', label: 'Timeline', icon: Clock, badge: caseEvents.length },
    { id: 'analysis', label: 'Analysis', icon: Activity },
  ] as const;

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
              <Badge variant={caseData.severity === 'critical' ? 'danger' : caseData.severity === 'high' ? 'warning' : 'info'}>
                {caseData.severity.toUpperCase()}
              </Badge>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseData.status)}`}>
                {caseData.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="primary" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Case
        </Button>
        <Button 
          variant="secondary" 
          className="gap-2"
          onClick={() => exportCaseToPDF(caseData, caseEvidence, caseEvents)}
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
        <Button variant="secondary" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        {caseData.status === 'open' && (
          <Button variant="secondary" className="gap-2 ml-auto">
            <CheckCircle className="w-4 h-4" />
            Mark as Resolved
          </Button>
        )}
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
              <p className="text-2xl font-bold text-gray-100">{caseData.stats.evidenceCount}</p>
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
              <p className="text-2xl font-bold text-gray-100">{caseData.stats.eventsCount}</p>
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
              <p className="text-2xl font-bold text-gray-100">{caseData.stats.suspiciousActivities}</p>
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
                {tab.badge && (
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
            {/* Main Info */}
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

                  {caseData.location && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </p>
                      <p className="text-gray-100">
                        {caseData.location.city}, {caseData.location.country}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {caseData.location.lat.toFixed(4)}, {caseData.location.lng.toFixed(4)}
                      </p>
                    </div>
                  )}

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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{caseData.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
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

              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-300">Case created</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(caseData.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-300">Last updated</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(caseData.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">
                Evidence Collection ({caseEvidence.length})
              </h2>
              <Button className="gap-2">
                <Shield className="w-4 h-4" />
                Upload Evidence
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseEvidence.map(evidence => (
                <EvidenceCard key={evidence.id} evidence={evidence} />
              ))}
            </div>

            {caseEvidence.length === 0 && (
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
                Event Timeline ({caseEvents.length})
              </h2>
            </div>
            
            <Timeline events={caseEvents} />

            {caseEvents.length === 0 && (
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
                      <li>• Multiple unauthorized access attempts detected</li>
                      <li>• Suspicious data exfiltration patterns identified</li>
                      <li>• Potential malware signatures found in logs</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="text-yellow-400 font-semibold mb-2">Recommendations</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Implement additional access controls</li>
                      <li>• Review and update firewall rules</li>
                      <li>• Conduct security awareness training</li>
                      <li>• Enable multi-factor authentication</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};