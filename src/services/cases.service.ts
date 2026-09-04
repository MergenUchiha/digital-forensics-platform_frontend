// src/services/cases.service.ts
import { api } from './api';
import type {
  Case,
  CreateCasePayload,
  UpdateCasePayload,
} from '@/types';

export const casesService = {
  async getAll(status?: string): Promise<Case[]> {
    const { data } = await api.get<Case[]>('/cases', {
      params: { status },
    });
    return data;
  },

  async getById(id: string): Promise<Case> {
    const { data } = await api.get<Case>(`/cases/${id}`);
    return data;
  },

  async create(caseData: CreateCasePayload): Promise<Case> {
    const { data } = await api.post<Case>('/cases', caseData);
    return data;
  },

  async update(id: string, caseData: UpdateCasePayload): Promise<Case> {
    const { data } = await api.put<Case>(`/cases/${id}`, caseData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cases/${id}`);
  },
};