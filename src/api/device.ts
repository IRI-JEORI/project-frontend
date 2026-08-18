import { apiRequest } from './client';
import { RegisterDeviceRequest, RegisterDeviceResponse } from './types';

export const registerDevice = (body: RegisterDeviceRequest) =>
  apiRequest<RegisterDeviceResponse>('/devices', { method: 'POST', body });
