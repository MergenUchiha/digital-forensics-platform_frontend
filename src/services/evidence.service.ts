// src/services/evidence.service.ts
import { api } from './api';
import { EvidenceItem } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const evidenceService = {
  async getAll(caseId?: string): Promise<EvidenceItem[]> {
    const { data } = await api.get<EvidenceItem[]>('/evidence', {
      params: { caseId },
    });
    return data;
  },

  async getById(id: string): Promise<EvidenceItem> {
    const { data } = await api.get<EvidenceItem>(`/evidence/${id}`);
    return data;
  },

  async create(evidenceData: any, file?: File): Promise<EvidenceItem> {
    const formData = new FormData();
    formData.append('name', evidenceData.name);
    formData.append('type', evidenceData.type);
    formData.append('caseId', evidenceData.caseId);
    if (evidenceData.description) {
      formData.append('description', evidenceData.description);
    }
    if (evidenceData.iotDeviceType) {
      formData.append('iotDeviceType', evidenceData.iotDeviceType);
    }
    if (evidenceData.metadata) {
      formData.append('metadata', JSON.stringify(evidenceData.metadata));
    }
    if (file) {
      formData.append('file', file);
    }

    const { data } = await api.post<EvidenceItem>('/evidence', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/evidence/${id}`);
  },

  getFileUrl(evidenceId: string): string {
    const token = localStorage.getItem('token');
    return `${API_URL}/evidence/${evidenceId}/file?token=${token}`;
  },
};
