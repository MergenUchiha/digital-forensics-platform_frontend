import { useState, useEffect } from 'react';
import { EvidenceCard } from '@/components/evidence/EvidenceCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { evidenceService } from '@/services/evidence.service';
import { casesService } from '@/services/cases.service';
import { EvidenceItem, Case } from '@/types';
import { Filter, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export const Evidence = () => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<string>('all');
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

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCase = selectedCase === 'all' || e.caseId === selectedCase;
    return matchesSearch && matchesCase;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading evidence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Evidence</h1>
          <p className="text-gray-400 mt-1">Collect and manage digital evidence</p>
        </div>
      </div>

      {/* Filters */}
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
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
          >
            <option value="all">All Cases</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
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
          <p className="text-gray-400">No evidence found</p>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <select
              value={uploadData.type}
              onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as any })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Case *
            </label>
            <select
              value={uploadData.caseId}
              onChange={(e) => setUploadData({ ...uploadData, caseId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyber-500"
              required
            >
              <option value="">Select a case...</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Describe the evidence..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-500"
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