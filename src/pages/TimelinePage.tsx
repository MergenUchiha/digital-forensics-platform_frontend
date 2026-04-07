import { useState, useEffect } from "react";
import { Timeline } from "@/components/timeline/Timeline";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { timelineService } from "@/services/timeline.service";
import { casesService } from "@/services/cases.service";
import { TimelineEvent, Case } from "@/types";
import { Download, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TimelinePage = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    type: "SYSTEM" as const,
    source: "",
    severity: "INFO" as const,
    title: "",
    description: "",
    caseId: "",
  });

  useEffect(() => {
    fetchData();
  }, [severityFilter, selectedCase]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventsData, casesData] = await Promise.all([
        timelineService.getAll(
          selectedCase === "all" ? undefined : selectedCase,
          severityFilter === "all" ? undefined : severityFilter,
        ),
        casesService.getAll(),
      ]);
      setEvents(eventsData);
      setCases(casesData);
    } catch (error) {
      console.error("Failed to fetch timeline events:", error);
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.messages.operationFailed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.caseId) {
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.timeline.selectCase,
      });
      return;
    }
    try {
      const apiData = {
        timestamp: new Date(newEvent.timestamp).toISOString(),
        type: newEvent.type.toUpperCase(),
        source: newEvent.source,
        severity: newEvent.severity.toUpperCase(),
        title: newEvent.title,
        description: newEvent.description,
        caseId: newEvent.caseId,
        metadata: {},
        ipAddresses: [],
        usernames: [],
        files: [],
        devices: [],
      };
      await timelineService.create(apiData);
      await fetchData();
      setIsCreateModalOpen(false);
      setNewEvent({
        timestamp: new Date().toISOString().slice(0, 16),
        type: "SYSTEM",
        source: "",
        severity: "INFO",
        title: "",
        description: "",
        caseId: "",
      });
      (window as any).showNotification?.({
        type: "success",
        title: t.timeline.eventCreated,
        message: t.timeline.eventCreated,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t.messages.operationFailed;
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: errorMessage,
      });
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t.timeline.loadingTimeline}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            {t.timeline.title}
          </h1>
          <p className="text-gray-400 mt-1">{t.timeline.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            {t.timeline.export}
          </Button>
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            {t.timeline.addEvent}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t.timeline.searchEvents}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
            >
              <option value="all">{t.timeline.allCases}</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                variant={severityFilter === "all" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("all")}
              >
                {t.timeline.all}
              </Button>
              <Button
                variant={severityFilter === "CRITICAL" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("CRITICAL")}
              >
                {t.timeline.critical}
              </Button>
              <Button
                variant={severityFilter === "HIGH" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("HIGH")}
              >
                {t.timeline.high}
              </Button>
              <Button
                variant={severityFilter === "INFO" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("INFO")}
              >
                {t.timeline.info}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredEvents.length > 0 ? (
        <Timeline events={filteredEvents} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">{t.timeline.noEvents}</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t.timeline.addEventTitle}
        size="md"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.cases.caseTitle} *
            </label>
            <select
              value={newEvent.caseId}
              onChange={(e) =>
                setNewEvent({ ...newEvent, caseId: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="">{t.timeline.selectCase}</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.timeline.timestamp} *
              </label>
              <Input
                type="datetime-local"
                value={newEvent.timestamp}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, timestamp: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.timeline.eventType} *
              </label>
              <select
                value={newEvent.type}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, type: e.target.value as any })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
                required
              >
                <option value="AUTHENTICATION">
                  {t.eventType.authentication}
                </option>
                <option value="NETWORK">{t.eventType.network}</option>
                <option value="FILE_ACCESS">{t.eventType.file_access}</option>
                <option value="SYSTEM">{t.eventType.system}</option>
                <option value="API_CALL">{t.eventType.api_call}</option>
                <option value="ALERT">{t.eventType.alert}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.timeline.source} *
              </label>
              <Input
                type="text"
                value={newEvent.source}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, source: e.target.value })
                }
                placeholder={t.timeline.sourcePlaceholder}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.timeline.severity} *
              </label>
              <select
                value={newEvent.severity}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, severity: e.target.value as any })
                }
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
                required
              >
                <option value="LOW">{t.severity.low}</option>
                <option value="MEDIUM">{t.severity.medium}</option>
                <option value="HIGH">{t.severity.high}</option>
                <option value="CRITICAL">{t.severity.critical}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.timeline.eventTitle} *
            </label>
            <Input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder={t.timeline.enterEventTitle}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.cases.description} *
            </label>
            <textarea
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder={t.timeline.describeEvent}
              rows={3}
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {t.timeline.createEvent}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
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
