import { useState, useEffect } from "react";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { evidenceService } from "@/services/evidence.service";
import { casesService } from "@/services/cases.service";
import { EvidenceItem, Case } from "@/types";
import { Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Evidence = () => {
  const { t } = useLanguage();
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [iotDeviceFilter, setIotDeviceFilter] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: "",
    type: "LOG" as string,
    description: "",
    caseId: "",
    iotDeviceType: "" as string,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [evidenceData, casesData] = await Promise.all([
        evidenceService.getAll(),
        casesService.getAll(),
      ]);
      setEvidence(evidenceData);
      setCases(casesData);
    } catch (error) {
      console.error("Failed to fetch evidence:", error);
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.messages.operationFailed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const isImage = file.type.startsWith('image/');
      setUploadData((prev) => ({
        ...prev,
        name: file.name,
        type: isImage ? 'PHOTO' : prev.type,
      }));
      setIsUploadModalOpen(true);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.caseId) {
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.evidence.selectCase,
      });
      return;
    }
    try {
      const { iotDeviceType, ...rest } = uploadData;
      const payload = iotDeviceType ? { ...rest, iotDeviceType } : rest;
      await evidenceService.create(payload, selectedFile || undefined);
      await fetchData();
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadData({ name: "", type: "LOG", description: "", caseId: "", iotDeviceType: "" });
      (window as any).showNotification?.({
        type: "success",
        title: t.evidence.evidenceUploaded,
        message: t.evidence.evidenceUploaded,
      });
    } catch (error) {
      (window as any).showNotification?.({
        type: "error",
        title: t.common.error,
        message: t.messages.operationFailed,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCase("all");
    setTypeFilter("all");
    setIotDeviceFilter("all");
  };

  const filteredEvidence = evidence.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCase = selectedCase === "all" || e.caseId === selectedCase;
    const matchesType =
      typeFilter === "all" || e.type.toUpperCase() === typeFilter;
    const matchesIotDevice =
      iotDeviceFilter === "all" || e.iotDeviceType === iotDeviceFilter;
    return matchesSearch && matchesCase && matchesType && matchesIotDevice;
  });

  const hasActiveFilters =
    selectedCase !== "all" || typeFilter !== "all" || iotDeviceFilter !== "all" || searchQuery !== "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">{t.evidence.loadingEvidence}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t.evidence.title}
          </h1>
          <p className="text-text-secondary mt-1">{t.evidence.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={t.evidence.searchEvidence}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
            >
              <option value="all">{t.evidence.allCases}</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <Button
              variant={isFilterOpen ? "primary" : "secondary"}
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {t.evidence.filters}
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-cyber-500 text-white text-xs rounded-full">
                  {
                    [
                      selectedCase !== "all",
                      typeFilter !== "all",
                      iotDeviceFilter !== "all",
                      searchQuery !== "",
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-bg-secondary border border-border-primary rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">
                {t.evidence.advancedFilters}
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  {t.evidence.clearAll}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t.evidence.evidenceType}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
                >
                  <option value="all">{t.evidence.allTypes}</option>
                  <option value="LOG">{t.evidenceType.log}</option>
                  <option value="NETWORK_CAPTURE">
                    {t.evidenceType.network_capture}
                  </option>
                  <option value="DISK_IMAGE">
                    {t.evidenceType.disk_image}
                  </option>
                  <option value="MEMORY_DUMP">
                    {t.evidenceType.memory_dump}
                  </option>
                  <option value="FILE">{t.evidenceType.file}</option>
                  <option value="API_RESPONSE">
                    {t.evidenceType.api_response}
                  </option>
                  <option value="PHOTO">
                    {t.evidenceType.photo}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t.evidence.iotDeviceSource}
                </label>
                <select
                  value={iotDeviceFilter}
                  onChange={(e) => setIotDeviceFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
                >
                  <option value="all">{t.evidence.allDevices}</option>
                  <option value="CAMERA">{t.iotDevice.camera}</option>
                  <option value="SMART_SPEAKER">{t.iotDevice.smart_speaker}</option>
                  <option value="SENSOR">{t.iotDevice.sensor}</option>
                  <option value="SMART_LOCK">{t.iotDevice.smart_lock}</option>
                  <option value="ROUTER">{t.iotDevice.router}</option>
                  <option value="DVR">{t.iotDevice.dvr}</option>
                  <option value="SMART_TV">{t.iotDevice.smart_tv}</option>
                  <option value="WEARABLE">{t.iotDevice.wearable}</option>
                  <option value="OTHER">{t.iotDevice.other}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t.evidence.results}
                </label>
                <div className="px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-secondary">
                  {filteredEvidence.length} / {evidence.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept="*"
          maxFiles={20}
          maxSize={500}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.map((ev, index) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EvidenceCard evidence={ev} />
          </motion.div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            {hasActiveFilters
              ? t.evidence.noEvidenceFilters
              : t.evidence.noEvidence}
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              {t.evidence.clearFilters}
            </Button>
          )}
        </div>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t.evidence.uploadEvidence}
        size="md"
      >
        <form onSubmit={handleUploadEvidence} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.evidence.evidenceName} *
            </label>
            <Input
              type="text"
              value={uploadData.name}
              onChange={(e) =>
                setUploadData({ ...uploadData, name: e.target.value })
              }
              placeholder={t.evidence.enterEvidenceName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.evidence.type} *
            </label>
            <select
              value={uploadData.type}
              onChange={(e) =>
                setUploadData({ ...uploadData, type: e.target.value as any })
              }
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="LOG">{t.evidenceType.log}</option>
              <option value="NETWORK_CAPTURE">
                {t.evidenceType.network_capture}
              </option>
              <option value="DISK_IMAGE">{t.evidenceType.disk_image}</option>
              <option value="MEMORY_DUMP">{t.evidenceType.memory_dump}</option>
              <option value="FILE">{t.evidenceType.file}</option>
              <option value="API_RESPONSE">
                {t.evidenceType.api_response}
              </option>
              <option value="PHOTO">{t.evidenceType.photo}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.evidence.iotDeviceSource}
            </label>
            <select
              value={uploadData.iotDeviceType}
              onChange={(e) =>
                setUploadData({ ...uploadData, iotDeviceType: e.target.value })
              }
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
            >
              <option value="">{t.evidence.noDevice}</option>
              <option value="CAMERA">{t.iotDevice.camera}</option>
              <option value="SMART_SPEAKER">{t.iotDevice.smart_speaker}</option>
              <option value="SENSOR">{t.iotDevice.sensor}</option>
              <option value="SMART_LOCK">{t.iotDevice.smart_lock}</option>
              <option value="ROUTER">{t.iotDevice.router}</option>
              <option value="DVR">{t.iotDevice.dvr}</option>
              <option value="SMART_TV">{t.iotDevice.smart_tv}</option>
              <option value="WEARABLE">{t.iotDevice.wearable}</option>
              <option value="OTHER">{t.iotDevice.other}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.evidence.selectCase} *
            </label>
            <select
              value={uploadData.caseId}
              onChange={(e) =>
                setUploadData({ ...uploadData, caseId: e.target.value })
              }
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="">{t.evidence.selectCasePlaceholder}</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t.evidence.description}
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) =>
                setUploadData({ ...uploadData, description: e.target.value })
              }
              placeholder={t.evidence.describeEvidence}
              rows={3}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-cyber-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1 gap-2">
              <Upload className="w-4 h-4" />
              {t.evidence.uploadEvidence}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsUploadModalOpen(false)}
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
