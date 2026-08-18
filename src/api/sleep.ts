import { apiRequest } from './client';
import { SleepFeedbackRequest, SleepRequest, SleepResponse } from './types';

export const sleep = (body: SleepRequest) =>
  apiRequest<SleepResponse>('/me/sleep', { method: 'POST', body });

export const sleepFeedback = (body: SleepFeedbackRequest) =>
  apiRequest<void>('/me/sleep-feedback', { method: 'POST', body });
