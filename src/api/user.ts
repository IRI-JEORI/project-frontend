import { apiRequest } from './client';
import { Me } from './types';

export const getMe = () => apiRequest<Me>('/users/me');

export const patchMe = (body: Partial<Pick<Me, 'nickname' | 'avatar_url'>>) =>
  apiRequest<Me>('/users/me', { method: 'PATCH', body });

export const deleteMe = () => apiRequest<void>('/users/me', { method: 'DELETE' });
