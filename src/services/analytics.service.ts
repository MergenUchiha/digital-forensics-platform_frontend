// src/services/analytics.service.ts
import { api } from './api';
import type {
  DashboardStats,
  SeverityCount,
  SourceCount,
  TimeSeriesPoint,
} from '@/types';

export const analyticsService = {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/analytics/dashboard');
    return data;
  },

  async getTimeSeries(hours?: number): Promise<TimeSeriesPoint[]> {
    const { data } = await api.get<TimeSeriesPoint[]>('/analytics/time-series', {
      params: { hours },
    });
    return data;
  },

  async getSeverityDistribution(): Promise<SeverityCount[]> {
    const { data } = await api.get<SeverityCount[]>(
      '/analytics/severity-distribution',
    );
    return data;
  },

  async getSourceDistribution(): Promise<SourceCount[]> {
    const { data } = await api.get<SourceCount[]>(
      '/analytics/source-distribution',
    );
    return data;
  },
};
