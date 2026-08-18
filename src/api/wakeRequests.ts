import { apiRequest, apiUpload } from './client';
import { ProofResponse, WakeRequestDetail, WakeRequestResponse } from './types';

export const wakeGroupMember = (groupId: number, userId: number) =>
  apiRequest<WakeRequestResponse>(`/wake-groups/${groupId}/members/${userId}/wake`, {
    method: 'POST',
  });

export const getWakeRequest = (id: number) =>
  apiRequest<WakeRequestDetail>(`/wake-requests/${id}`);

export const submitProof = (
  wakeRequestId: number,
  file: { uri: string; name: string; type: string },
) => apiUpload<ProofResponse>(`/wake-requests/${wakeRequestId}/proof`, 'image', file);

export const selfVerify = () =>
  apiRequest<WakeRequestResponse>('/me/self-verify', { method: 'POST' });
