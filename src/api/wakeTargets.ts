import { apiRequest } from './client';
import {
  DayOfWeek,
  UpsertWakeTargetRequest,
  UpsertWakeTargetResponse,
  WakeTargetsResponse,
} from './types';

export const getWakeTargets = () => apiRequest<WakeTargetsResponse>('/me/wake-targets');

export const upsertWakeTarget = (body: UpsertWakeTargetRequest) =>
  apiRequest<UpsertWakeTargetResponse>('/me/wake-targets', { method: 'POST', body });

export const deleteWakeTarget = (dayOfWeek: DayOfWeek) =>
  apiRequest<void>(`/me/wake-targets/${dayOfWeek}`, { method: 'DELETE' });
