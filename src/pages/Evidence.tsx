import { useState, useEffect } from 'react';
import { EvidenceCard } from '@/components/evidence/EvidenceCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { evidenceService } from '@/services/evidence.service';
import { casesService } from '@/services/cases.service';
import { EvidenceItem, Case } from '@/types';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const Evidence = () => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'LOG' as const,
    description: '',
    caseId: '',
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
      console.error('Failed to fetch evidence:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to load evidence',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setUploadData(prev => ({
        ...prev,
        name: files[0].name,
      }));
      setIsUploadModalOpen(true);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.caseId) {
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Please select a case',
      });
      return;
    }

    try {
      await evidenceService.create(uploadData);
      await fetchData();
      setIsUploadModalOpen(false);
      setUploadData({
        name: '',
        type: 'LOG',
        description: '',
        caseId: '',
      });
      
      (window as any).showNotification?.({
        type: 'success',
        title: 'Evidence Uploaded',
        message: 'Evidence has been successfully uploaded',
      });
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      (window as any).showNotification?.({
        type: 'error',
        title: 'Error',
        message: 'Failed to upload evidence',
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCase('all');
    setTypeFilter('all');
  };

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCase = selectedCase === 'all' || e.caseId === selectedCase;
    const matchesType = typeFilter === 'all' || e.type.toUpperCase() === typeFilter;
    return matchesSearch && matchesCase && matchesType;
  });

  const hasActiveFilters = selectedCase !== 'all' || typeFilter !== 'all' || searchQuery !== '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading evidence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Evidence</h1>
          <p className="text-text-secondary mt-1">Collect and manage digital evidence</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search evidence..."
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
              <option value="all">All Cases</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <Button 
              variant={isFilterOpen ? 'primary' : 'secondary'} 
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-cyber-500 text-white text-xs rounded-full">
                  {[selectedCase !== 'all', typeFilter !== 'all', searchQuery !== ''].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-bg-secondary border border-border-primary rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Advanced Filters</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Evidence Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
                >
                  <option value="all">All Types</option>
                  <option value="LOG">Log</option>
                  <option value="NETWORK_CAPTURE">Network Capture</option>
                  <option value="DISK_IMAGE">Disk Image</option>
                  <option value="MEMORY_DUMP">Memory Dump</option>
                  <option value="FILE">File</option>
                  <option value="API_RESPONSE">API Response</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Results
                </label>
                <div className="px-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-secondary">
                  {filteredEvidence.length} of {evidence.length} items
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Zone */}
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

      {/* Evidence Grid */}
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
            {hasActiveFilters ? 'No evidence found matching your filters' : 'No evidence found'}
          </p>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Evidence"
        size="md"
      >
        <form onSubmit={handleUploadEvidence} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Evidence Name *
            </label>
            <Input
              type="text"
              value={uploadData.name}
              onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
              placeholder="Enter evidence name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Type *
            </label>
            <select
              value={uploadData.type}
              onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as any })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="LOG">Log</option>
              <option value="NETWORK_CAPTURE">Network Capture</option>
              <option value="DISK_IMAGE">Disk Image</option>
              <option value="MEMORY_DUMP">Memory Dump</option>
              <option value="FILE">File</option>
              <option value="API_RESPONSE">API Response</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Case *
            </label>
            <select
              value={uploadData.caseId}
              onChange={(e) => setUploadData({ ...uploadData, caseId: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="">Select a case...</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Describe the evidence..."
              rows={3}
              className="w-full px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-cyber-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1 gap-2">
              <Upload className="w-4 h-4" />
              Upload Evidence
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsUploadModalOpen(false)}
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