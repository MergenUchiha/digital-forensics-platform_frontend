import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Timeline } from "@/components/timeline/Timeline";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { Case, EvidenceItem, TimelineEvent } from "@/types";
import { formatDate, formatRelativeTime, getStatusColor } from "@/utils/format";
import { exportCaseToPDF } from "@/utils/pdfExport";
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
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import { casesService } from "@/services/cases.service";
import { evidenceService } from "@/services/evidence.service";
import { timelineService } from "@/services/timeline.service";
import { useLanguage } from "@/contexts/LanguageContext";

export const CaseDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "evidence" | "timeline" | "analysis"
  >("overview");
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    status: "OPEN",
  });

  useEffect(() => {
    if (id) fetchCaseData(id);
  }, [id]);

  const fetchCaseData = async (caseId: string) => {
    try {
      setIsLoading(true);
      const [caseResponse, evidenceResponse, eventsResponse] =
        await Promise.all([
          casesService.getById(caseId),
          evidenceService.getAll(caseId),
          timelineService.getAll(caseId),
        ]);
      setCaseData(caseResponse);
      setEvidence(evidenceResponse);
      setEvents(eventsResponse);
      setEditFormData({
        title: caseResponse.title,
        description: caseResponse.description,
        severity: caseResponse.severity.toString().toUpperCase(),
        status: caseResponse.status.toString().toUpperCase(),
      });
    } catch (error: any) {
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.caseDetails.caseNotFoundMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !caseData) return;
    try {
      const updateData: any = {};
      if (editFormData.title !== caseData.title)
        updateData.title = editFormData.title;
      if (editFormData.description !== caseData.description)
        updateData.description = editFormData.description;
      if (
        editFormData.severity.toUpperCase() !==
        caseData.severity.toString().toUpperCase()
      )
        updateData.severity = editFormData.severity.toUpperCase();
      if (
        editFormData.status.toUpperCase() !==
        caseData.status.toString().toUpperCase()
      )
        updateData.status = editFormData.status.toUpperCase();

      if (Object.keys(updateData).length === 0) {
        (window as any).showNotification?.({
          type: "info",
          title: t.caseDetails.noChanges,
          message: t.caseDetails.noChangesMsg,
        });
        setIsEditModalOpen(false);
        return;
      }
      await casesService.update(id, updateData);
      await fetchCaseData(id);
      setIsEditModalOpen(false);
      (window as any).showNotification?.({
        type: "success",
        title: t.caseDetails.caseUpdated,
        message: t.caseDetails.caseUpdatedMsg,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t.messages.operationFailed;
      (window as any).showNotification?.({
        type: "error",
        title: t.caseDetails.updateFailed,
        message: errorMessage,
      });
    }
  };

  const handleExportPDF = () => {
    if (caseData) exportCaseToPDF(caseData, evidence, events);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      (window as any).showNotification?.({
        type: "success",
        title: t.caseDetails.linkCopied,
        message: t.caseDetails.linkCopiedMsg,
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t.caseDetails.loadingCase}</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            {t.caseDetails.caseNotFound}
          </h2>
          <p className="text-gray-400 mb-4">{t.caseDetails.caseNotFoundMsg}</p>
          <Button onClick={() => navigate("/cases")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.caseDetails.backToCases}
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: t.caseDetails.overview, icon: Shield },
    {
      id: "evidence" as const,
      label: t.caseDetails.evidence,
      icon: Database,
      badge: evidence.length,
    },
    {
      id: "timeline" as const,
      label: t.caseDetails.timeline,
      icon: Clock,
      badge: events.length,
    },
    { id: "analysis" as const, label: t.caseDetails.analysis, icon: Activity },
  ];

  const severityColors: any = {
    critical: "danger",
    high: "warning",
    medium: "info",
    low: "success",
    CRITICAL: "danger",
    HIGH: "warning",
    MEDIUM: "info",
    LOW: "success",
  };

  const severity = caseData.severity.toString().toLowerCase();
  const status = caseData.status.toString().toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cases")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.caseDetails.backToCases}
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
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
              >
                {status.replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="w-4 h-4" />
          {t.caseDetails.editCase}
        </Button>
        <Button variant="secondary" className="gap-2" onClick={handleExportPDF}>
          <Download className="w-4 h-4" />
          {t.caseDetails.exportReport}
        </Button>
        <Button variant="secondary" className="gap-2" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          {t.caseDetails.share}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {t.caseDetails.evidenceCollected}
              </p>
              <p className="text-2xl font-bold text-gray-100">
                {evidence.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {t.caseDetails.eventsLogged}
              </p>
              <p className="text-2xl font-bold text-gray-100">
                {events.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {t.caseDetails.suspiciousActivities}
              </p>
              <p className="text-2xl font-bold text-gray-100">
                {
                  events.filter((e) => {
                    const sev = e.severity.toString().toUpperCase();
                    return sev === "CRITICAL" || sev === "HIGH";
                  }).length
                }
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
              <p className="text-sm text-gray-400">
                {t.caseDetails.timeElapsed}
              </p>
              <p className="text-2xl font-bold text-gray-100">
                {Math.floor(
                  (Date.now() - new Date(caseData.createdAt).getTime()) /
                    (1000 * 60 * 60),
                )}
                h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-800">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${isActive ? "text-cyber-400 border-b-2 border-cyber-400" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {"badge" in tab && tab.badge !== undefined && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.caseDetails.caseInformation}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t.caseDetails.caseId}
                      </p>
                      <p className="text-gray-100 font-mono text-sm">
                        {caseData.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t.caseDetails.created}
                      </p>
                      <p className="text-gray-100">
                        {formatDate(caseData.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t.caseDetails.lastUpdated}
                      </p>
                      <p className="text-gray-100">
                        {formatRelativeTime(caseData.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t.caseDetails.assignedTo}
                      </p>
                      <p className="text-gray-100">
                        {caseData.assignedTo?.name || t.caseDetails.unassigned}
                      </p>
                    </div>
                  </div>
                  {(caseData.location ||
                    (caseData.locationCity && caseData.locationCountry)) && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {t.caseDetails.location}
                      </p>
                      <p className="text-gray-100">
                        {caseData.location
                          ? `${caseData.location.city}, ${caseData.location.country}`
                          : `${caseData.locationCity}, ${caseData.locationCountry}`}
                      </p>
                    </div>
                  )}
                  {caseData.tags && caseData.tags.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-500 mb-2">
                        {t.caseDetails.tags}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {caseData.tags.map((tag) => (
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
                  <CardTitle>{t.caseDetails.team}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {caseData.createdBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-100">
                        {caseData.createdBy.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.caseDetails.caseCreator}
                      </p>
                    </div>
                  </div>
                  {caseData.assignedTo && (
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {caseData.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">
                          {caseData.assignedTo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t.caseDetails.assignedAnalyst}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-100">
              {t.caseDetails.evidenceCollection} ({evidence.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evidence.map((ev) => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
            {evidence.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{t.caseDetails.noEvidenceYet}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-100">
              {t.caseDetails.eventTimeline} ({events.length})
            </h2>
            <Timeline events={events} />
            {events.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">{t.caseDetails.noEventsYet}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.caseDetails.threatAnalysis}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">
                    {t.caseDetails.criticalFindings}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      •{" "}
                      {
                        events.filter((e) => {
                          const sev = e.severity.toString().toUpperCase();
                          return sev === "CRITICAL" || sev === "HIGH";
                        }).length
                      }{" "}
                      {t.caseDetails.suspiciousActivities}
                    </li>
                    <li>
                      • {evidence.length} {t.caseDetails.evidenceCollected}
                    </li>
                    <li>• {t.caseDetails.investigationOngoing}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t.caseDetails.editCaseTitle}
        size="lg"
      >
        <form onSubmit={handleEditCase} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.caseDetails.caseTitle}
            </label>
            <Input
              type="text"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.caseDetails.description}
            </label>
            <textarea
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                })
              }
              rows={4}
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.caseDetails.severity}
              </label>
              <select
                value={editFormData.severity}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, severity: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              >
                <option value="LOW">{t.severity.low}</option>
                <option value="MEDIUM">{t.severity.medium}</option>
                <option value="HIGH">{t.severity.high}</option>
                <option value="CRITICAL">{t.severity.critical}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.caseDetails.status}
              </label>
              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, status: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              >
                <option value="OPEN">{t.status.open}</option>
                <option value="IN_PROGRESS">{t.status.in_progress}</option>
                <option value="CLOSED">{t.status.closed}</option>
                <option value="ARCHIVED">{t.status.archived}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {t.caseDetails.saveChanges}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              {t.common.cancel}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
