import { apiRequest } from './client';
import { CreateDndWindowRequest, DndWindow, DndWindowsResponse } from './types';

export const getDndWindows = () => apiRequest<DndWindowsResponse>('/me/dnd-windows');

export const createDndWindow = (body: CreateDndWindowRequest) =>
  apiRequest<DndWindow>('/me/dnd-windows', { method: 'POST', body });

export const deleteDndWindow = (id: number) =>
  apiRequest<void>(`/me/dnd-windows/${id}`, { method: 'DELETE' });
