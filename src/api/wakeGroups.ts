import { apiRequest } from './client';
import {
  CreateWakeGroupRequest,
  GroupsResponse,
  InviteCodeResponse,
  JoinWakeGroupRequest,
  PatchWakeGroupRequest,
  WakeGroup,
  WakeGroupDetail,
  WakeGroupPreview,
} from './types';

export const getGroups = () => apiRequest<GroupsResponse>('/groups');

export const createWakeGroup = (body: CreateWakeGroupRequest) =>
  apiRequest<WakeGroup>('/wake-groups', { method: 'POST', body });

export const getWakeGroup = (id: number) =>
  apiRequest<WakeGroupDetail>(`/wake-groups/${id}`);

export const patchWakeGroup = (id: number, body: PatchWakeGroupRequest) =>
  apiRequest<WakeGroup>(`/wake-groups/${id}`, { method: 'PATCH', body });

export const previewInviteCode = (code: string) =>
  apiRequest<WakeGroupPreview>('/wake-groups/preview', { query: { code } });

export const joinWakeGroup = (body: JoinWakeGroupRequest) =>
  apiRequest<WakeGroup>('/wake-groups/join', { method: 'POST', body });

export const getInviteCode = (id: number) =>
  apiRequest<InviteCodeResponse>(`/wake-groups/${id}/invite-code`);
