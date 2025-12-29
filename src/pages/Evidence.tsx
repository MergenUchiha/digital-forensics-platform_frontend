import { useState } from 'react';
import { EvidenceCard } from '@/components/evidence/EvidenceCard';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { mockEvidence } from '@/data/mockData';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const Evidence = () => {
  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files);
    // Здесь будет загрузка на сервер
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Evidence</h1>
          <p className="text-gray-400 mt-1">Collect and manage digital evidence</p>
        </div>
        <Button className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
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
        {mockEvidence.map((evidence, index) => (
          <motion.div
            key={evidence.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EvidenceCard evidence={evidence} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};