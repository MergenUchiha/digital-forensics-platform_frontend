// src/services/timeline.service.ts
import { api } from './api';
import { TimelineEvent } from '@/types';

export const timelineService = {
  async getAll(caseId?: string, severity?: string): Promise<TimelineEvent[]> {
    const { data } = await api.get<TimelineEvent[]>('/timeline', {
      params: { caseId, severity },
    });
    return data;
  },

  async getById(id: string): Promise<TimelineEvent> {
    const { data } = await api.get<TimelineEvent>(`/timeline/${id}`);
    return data;
  },

  async create(eventData: any): Promise<TimelineEvent> {
    const { data } = await api.post<TimelineEvent>('/timeline', eventData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/timeline/${id}`);
  },
};