import AsyncStorage from '@react-native-async-storage/async-storage';
import { nunnunApi } from '../nunnunApi';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const response = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

describe('deviceApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === '@nunnun/auth/access-token' ? 'access-token' : null,
      ),
    );
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: { registered: true } }),
    ) as jest.Mock;
  });

  it('registers an Android FCM token with JWT authorization', async () => {
    await expect(nunnunApi.device.register('fcm-token')).resolves.toEqual({
      registered: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/devices$/),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
        body: JSON.stringify({
          fcm_token: 'fcm-token',
          platform: 'ANDROID',
        }),
      }),
    );
  });
});
