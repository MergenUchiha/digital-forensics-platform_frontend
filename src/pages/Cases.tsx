import { useState, useEffect } from "react";
import { CaseCard } from "@/components/cases/CaseCard";
import {
  CreateCaseModal,
  CaseFormData,
} from "@/components/cases/CreateCaseModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { casesService } from "@/services/cases.service";
import { Case } from "@/types";
import { Plus, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Cases = () => {
  const { t } = useLanguage();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await casesService.getAll(
        statusFilter === "all" ? undefined : statusFilter,
      );

      const normalizedData = data.map((c) => ({
        ...c,
        severity: (c.severity || "medium").toLowerCase(),
        status: (c.status || "open").toLowerCase(),
        tags: c.tags || [],
        evidenceCount: c.evidenceCount || c.stats?.evidenceCount || 0,
        eventsCount: c.eventsCount || c.stats?.eventsCount || 0,
        suspiciousActivities:
          c.suspiciousActivities || c.stats?.suspiciousActivities || 0,
      }));

      setCases(normalizedData as Case[]);
    } catch (error: any) {
      console.error("Failed to fetch cases:", error);
      setError(error.response?.data?.message || t.cases.errorLoading);

      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.cases.errorLoading,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCase = async (data: CaseFormData) => {
    try {
      const apiData = {
        title: data.title,
        description: data.description,
        severity: data.severity.toUpperCase() as
          | "LOW"
          | "MEDIUM"
          | "HIGH"
          | "CRITICAL",
        status: (data.status || "open").toUpperCase() as
          | "OPEN"
          | "IN_PROGRESS"
          | "CLOSED"
          | "ARCHIVED",
        tags: data.tags || [],
        location: data.location,
        assignedToId: data.assignedToId,
      };

      await casesService.create(apiData);
      await fetchCases();

      (window as any).showNotification?.({
        type: "success",
        title: t.cases.caseCreated,
        message: `${t.cases.caseCreated}: "${data.title}"`,
      });
    } catch (error: any) {
      console.error("Failed to create case:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        t.messages.operationFailed;
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: errorMessage,
      });
      throw error;
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{t.cases.loadingCases}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 text-status-error mx-auto mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            {t.cases.errorLoading}
          </h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button onClick={fetchCases}>{t.cases.tryAgain}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t.cases.title}
          </h1>
          <p className="text-text-secondary mt-1">{t.cases.subtitle}</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" />
          {t.cases.newCase}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            type="text"
            placeholder={t.cases.searchCases}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            {t.cases.all}
          </Button>
          <Button
            variant={statusFilter === "open" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("open")}
          >
            {t.cases.open}
          </Button>
          <Button
            variant={statusFilter === "in_progress" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("in_progress")}
          >
            {t.cases.inProgress}
          </Button>
          <Button
            variant={statusFilter === "closed" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("closed")}
          >
            {t.cases.closed}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((c) => (
          <CaseCard key={c.id} case={c} />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">{t.cases.noCases}</p>
        </div>
      )}

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
};
