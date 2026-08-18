import { apiRequest } from './client';
import { CreateFixedScheduleRequest, FixedSchedule } from './types';

export interface FixedSchedulesResponse {
  schedules: FixedSchedule[];
}

export const getFixedSchedules = () =>
  apiRequest<FixedSchedulesResponse>('/me/fixed-schedules');

export const createFixedSchedule = (body: CreateFixedScheduleRequest) =>
  apiRequest<FixedSchedule>('/me/fixed-schedules', { method: 'POST', body });

export const updateFixedSchedule = (id: number, body: Partial<CreateFixedScheduleRequest>) =>
  apiRequest<FixedSchedule>(`/me/fixed-schedules/${id}`, { method: 'PATCH', body });

export const deleteFixedSchedule = (id: number) =>
  apiRequest<void>(`/me/fixed-schedules/${id}`, { method: 'DELETE' });

export const updateTodayBedTime = (bedTime: string) =>
  apiRequest<void>('/me/today/bed-time', { method: 'PATCH', body: { bed_time: bedTime } });

export const updateTodayReturnTime = (returnTime: string) =>
  apiRequest<void>('/me/today/return-time', {
    method: 'PATCH',
    body: { return_time: returnTime },
  });
