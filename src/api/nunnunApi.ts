import { UPLOAD_TIMEOUT_MS } from '../config/api';
import { apiRequest, createImageFormData } from './client';
import { tokenStorage } from './tokenStorage';
import type {
  AuthTokens,
  DayOfWeek,
  DemoLoginResponse,
  DndWindow,
  FixedSchedule,
  JsonObject,
  SelfVerifyCreated,
  User,
  WakeGroupDetail,
  WakeGroupPreview,
  WakeGroupSummary,
  WakeProofResult,
  WakeRequest,
  WakeRequestCreated,
  WakeTarget,
} from './types';

const encode = (value: string | number) => encodeURIComponent(String(value));

export const authApi = {
  getDemoAccounts: () =>
    apiRequest<{ accounts: User[] }>('/demo-accounts', { auth: false }),

  demoLogin: async (demoAccountId: number) => {
    const response = await apiRequest<DemoLoginResponse>('/auth/demo-login', {
      method: 'POST',
      auth: false,
      body: { demo_account_id: demoAccountId },
    });
    await tokenStorage.save(response);
    return response;
  },

  reissue: async (refreshToken: string) => {
    const response = await apiRequest<AuthTokens>('/auth/reissue', {
      method: 'POST',
      auth: false,
      body: { refresh_token: refreshToken },
    });
    await tokenStorage.save(response);
    return response;
  },

  logout: async () => {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } finally {
      await tokenStorage.clear();
    }
  },
};

export const userApi = {
  getMe: () => apiRequest<User>('/users/me'),
  updateMe: (input: { nickname?: string; avatar_url?: string | null }) =>
    apiRequest<User>('/users/me', { method: 'PATCH', body: input }),
  deleteMe: () => apiRequest<void>('/users/me', { method: 'DELETE' }),
};

export const deviceApi = {
  register: (fcmToken: string) =>
    apiRequest<{ registered: boolean }>('/devices', {
      method: 'POST',
      body: { fcm_token: fcmToken, platform: 'ANDROID' },
    }),
};

export const wakeTargetApi = {
  list: () => apiRequest<{ targets: WakeTarget[] }>('/me/wake-targets'),
  upsert: (text: string) =>
    apiRequest<WakeTarget & { display_text: string }>('/me/wake-targets', {
      method: 'POST',
      body: { text },
    }),
  remove: (dayOfWeek: DayOfWeek) =>
    apiRequest<void>(`/me/wake-targets/${dayOfWeek}`, { method: 'DELETE' }),
};

export const dndApi = {
  list: () => apiRequest<{ windows: DndWindow[] }>('/me/dnd-windows'),
  create: (text: string) =>
    apiRequest<DndWindow>('/me/dnd-windows', {
      method: 'POST',
      body: { text },
    }),
  remove: (id: number) =>
    apiRequest<void>(`/me/dnd-windows/${encode(id)}`, { method: 'DELETE' }),
};

export const scheduleApi = {
  list: () => apiRequest<{ schedules: FixedSchedule[] }>('/me/fixed-schedules'),
  create: (input: Omit<FixedSchedule, 'id'>) =>
    apiRequest<FixedSchedule>('/me/fixed-schedules', {
      method: 'POST',
      body: input,
    }),
  update: (id: number, input: Partial<Omit<FixedSchedule, 'id'>>) =>
    apiRequest<FixedSchedule>(`/me/fixed-schedules/${encode(id)}`, {
      method: 'PATCH',
      body: input,
    }),
  remove: (id: number) =>
    apiRequest<void>(`/me/fixed-schedules/${encode(id)}`, {
      method: 'DELETE',
    }),
  analyzeImage: (imagePath: string) =>
    apiRequest<JsonObject>('/me/fixed-schedules/analyze', {
      method: 'POST',
      body: createImageFormData(imagePath),
      timeoutMs: UPLOAD_TIMEOUT_MS,
    }),
  import: (input: JsonObject) =>
    apiRequest<JsonObject>('/me/fixed-schedules/import', {
      method: 'POST',
      body: input,
    }),
};

export const groupApi = {
  list: () => apiRequest<{ groups: WakeGroupSummary[] }>('/groups'),
  create: (name: string) =>
    apiRequest<WakeGroupSummary & { invite_code: string }>('/wake-groups', {
      method: 'POST',
      body: { name },
    }),
  detail: (id: number) =>
    apiRequest<WakeGroupDetail>(`/wake-groups/${encode(id)}`),
  rename: (id: number, name: string) =>
    apiRequest<WakeGroupDetail>(`/wake-groups/${encode(id)}`, {
      method: 'PATCH',
      body: { name },
    }),
  preview: (inviteCode: string) =>
    apiRequest<WakeGroupPreview>(
      `/wake-groups/preview?code=${encode(inviteCode)}`,
    ),
  join: (inviteCode: string) =>
    apiRequest<WakeGroupDetail>('/wake-groups/join', {
      method: 'POST',
      body: { invite_code: inviteCode },
    }),
  getInviteCode: (id: number) =>
    apiRequest<{ invite_code: string }>(
      `/wake-groups/${encode(id)}/invite-code`,
    ),
};

export const wakeApi = {
  wakeMember: (groupId: number, userId: number) =>
    apiRequest<WakeRequestCreated>(
      `/wake-groups/${encode(groupId)}/members/${encode(userId)}/wake`,
      { method: 'POST' },
    ),
  getRequest: (wakeRequestId: number) =>
    apiRequest<WakeRequest>(`/wake-requests/${encode(wakeRequestId)}`),
  uploadProof: (wakeRequestId: number, imagePath: string) =>
    apiRequest<WakeProofResult>(
      `/wake-requests/${encode(wakeRequestId)}/proof`,
      {
        method: 'POST',
        body: createImageFormData(imagePath),
        timeoutMs: UPLOAD_TIMEOUT_MS,
      },
    ),
  startSelfVerify: () =>
    apiRequest<SelfVerifyCreated>('/me/self-verify', { method: 'POST' }),
};

export const meApi = {
  getToday: () => apiRequest<JsonObject>('/me/today'),
  updateBedTime: (bedTime: string) =>
    apiRequest<JsonObject>('/me/today/bed-time', {
      method: 'PATCH',
      body: { bed_time: bedTime },
    }),
  updateReturnTime: (returnTime: string) =>
    apiRequest<JsonObject>('/me/today/return-time', {
      method: 'PATCH',
      body: { return_time: returnTime },
    }),
  sleep: () => apiRequest<JsonObject>('/me/sleep', { method: 'POST' }),
  getStats: () => apiRequest<JsonObject>('/me/stats'),
  submitSleepFeedback: (input: JsonObject) =>
    apiRequest<JsonObject>('/me/sleep-feedback', {
      method: 'POST',
      body: input,
    }),
};

export const nunnunApi = {
  auth: authApi,
  user: userApi,
  device: deviceApi,
  wakeTarget: wakeTargetApi,
  dnd: dndApi,
  schedule: scheduleApi,
  group: groupApi,
  wake: wakeApi,
  me: meApi,
};
