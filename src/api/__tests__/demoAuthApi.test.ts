import AsyncStorage from '@react-native-async-storage/async-storage';
import { nunnunApi } from '../nunnunApi';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const response = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

describe('demo auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('unwraps demo accounts from the backend response envelope', async () => {
    globalThis.fetch = jest.fn(() =>
      response({
        success: true,
        data: {
          accounts: [{ id: 1, nickname: '눈눈', avatar_url: null }],
        },
      }),
    ) as jest.Mock;

    await expect(nunnunApi.auth.getDemoAccounts()).resolves.toEqual({
      accounts: [{ id: 1, nickname: '눈눈', avatar_url: null }],
    });
  });

  it('stores tokens returned by demo login', async () => {
    globalThis.fetch = jest.fn(() =>
      response({
        success: true,
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          user: { id: 1, nickname: '눈눈', avatar_url: null },
        },
      }),
    ) as jest.Mock;

    await nunnunApi.auth.demoLogin(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/demo-login$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ demo_account_id: 1 }),
      }),
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@nunnun/auth/access-token',
      'access-token',
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@nunnun/auth/refresh-token',
      'refresh-token',
    );
  });
});
