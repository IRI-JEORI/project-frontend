import { apiRequest } from './client';
import { DemoAccountsResponse, DemoLoginResponse, ReissueResponse } from './types';

export const getDemoAccounts = () =>
  apiRequest<DemoAccountsResponse>('/demo-accounts', { auth: false });

export const demoLogin = (demoAccountId: number) =>
  apiRequest<DemoLoginResponse>('/auth/demo-login', {
    method: 'POST',
    auth: false,
    body: { demo_account_id: demoAccountId },
  });

export const reissue = (refreshToken: string) =>
  apiRequest<ReissueResponse>('/auth/reissue', {
    method: 'POST',
    auth: false,
    body: { refresh_token: refreshToken },
  });

export const logout = () => apiRequest<void>('/auth/logout', { method: 'POST' });
