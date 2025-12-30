// src/services/evidence.service.ts
import { api } from './api';
import { EvidenceItem } from '@/types';

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

  async create(evidenceData: any): Promise<EvidenceItem> {
    const { data } = await api.post<EvidenceItem>('/evidence', evidenceData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/evidence/${id}`);
  },
};