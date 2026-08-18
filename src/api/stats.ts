import { apiRequest } from './client';
import { StatsResponse } from './types';

export const getStats = () => apiRequest<StatsResponse>('/me/stats');
