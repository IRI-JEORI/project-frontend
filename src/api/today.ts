import { apiRequest } from './client';
import { TodayResponse } from './types';

export const getToday = () => apiRequest<TodayResponse>('/me/today');
