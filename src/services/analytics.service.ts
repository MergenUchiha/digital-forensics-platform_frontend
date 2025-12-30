// src/services/analytics.service.ts
import { api } from './api';

export const analyticsService = {
  async getDashboard(): Promise<any> {
    const { data } = await api.get('/analytics/dashboard');
    return data;
  },

  async getTimeSeries(hours?: number): Promise<any> {
    const { data } = await api.get('/analytics/time-series', {
      params: { hours },
    });
    return data;
  },

  async getSeverityDistribution(): Promise<any> {
    const { data } = await api.get('/analytics/severity-distribution');
    return data;
  },

  async getSourceDistribution(): Promise<any> {
    const { data } = await api.get('/analytics/source-distribution');
    return data;
  },
};