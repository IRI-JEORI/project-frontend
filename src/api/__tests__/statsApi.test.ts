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

describe('wake stats API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets and parses all three backend statistics without query parameters', async () => {
    const stats = {
      success_rate: 75.0,
      avg_gap_minutes: 2.5,
      streak_days: 3,
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: stats }),
    ) as jest.Mock;

    await expect(nunnunApi.me.getStats()).resolves.toEqual(stats);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/stats$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it('parses the backend zero response without inventing an empty flag', async () => {
    const stats = { success_rate: 0.0, avg_gap_minutes: 0.0, streak_days: 0 };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: stats }),
    ) as jest.Mock;

    await expect(nunnunApi.me.getStats()).resolves.toEqual(stats);
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [404, 'USER_NOT_FOUND'],
  ] as const)('surfaces %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response({ success: false, error: { code, message: 'stats error' } }, status),
    ) as jest.Mock;

    await expect(nunnunApi.me.getStats()).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });

  it('reissues and retries stats once for EXPIRED_JWT', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('expired-access')
      .mockResolvedValueOnce('refresh-token')
      .mockResolvedValueOnce('new-access');
    const stats = { success_rate: 75.0, avg_gap_minutes: 2.5, streak_days: 3 };
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        response(
          {
            success: false,
            error: { code: 'EXPIRED_JWT', message: 'Expired token.' },
          },
          401,
        ),
      )
      .mockImplementationOnce(() =>
        response({
          success: true,
          data: {
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
          },
        }),
      )
      .mockImplementationOnce(() => response({ success: true, data: stats })) as jest.Mock;

    await expect(nunnunApi.me.getStats()).resolves.toEqual(stats);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect((fetch as jest.Mock).mock.calls[1][0]).toMatch(/\/auth\/reissue$/);
    expect((fetch as jest.Mock).mock.calls[2][1].headers.Authorization).toBe(
      'Bearer new-access',
    );
  });
});
