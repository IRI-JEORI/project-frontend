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

describe('wake target API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets all weekday targets including unset days', async () => {
    const targets = [
      { day_of_week: 'MONDAY', display_day: '월요일', target_wake_time: '07:30' },
      { day_of_week: 'TUESDAY', display_day: '화요일', target_wake_time: null },
    ];
    globalThis.fetch = jest.fn(() => response({ success: true, data: { targets } })) as jest.Mock;

    await expect(nunnunApi.wakeTarget.list()).resolves.toEqual({ targets });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/wake-targets$/),
      expect.objectContaining({ method: 'GET', headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }),
    );
  });

  it('upserts the exact Korean weekday and HH:mm text', async () => {
    const updated = { day_of_week: 'MONDAY', target_wake_time: '07:30', display_text: '월요일, 07:30' };
    globalThis.fetch = jest.fn(() => response({ success: true, data: updated })) as jest.Mock;

    await expect(nunnunApi.wakeTarget.upsert('월요일, 07:30')).resolves.toEqual(updated);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/wake-targets$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: '월요일, 07:30' }),
        headers: expect.objectContaining({ Authorization: 'Bearer access-token', 'Content-Type': 'application/json' }),
      }),
    );
  });

  it('deletes by weekday and parses the null response', async () => {
    globalThis.fetch = jest.fn(() => response({ success: true, data: null })) as jest.Mock;

    await expect(nunnunApi.wakeTarget.remove('MONDAY')).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/wake-targets\/MONDAY$/),
      expect.objectContaining({ method: 'DELETE', headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }),
    );
  });

  it.each([
    ['list', 401, 'UNAUTHORIZED'],
    ['upsert', 400, 'INVALID_WAKE_TARGET_FORMAT'],
    ['upsert', 404, 'USER_NOT_FOUND'],
    ['remove', 401, 'UNAUTHORIZED'],
    ['remove', 404, 'WAKE_TARGET_NOT_FOUND'],
  ] as const)('surfaces %s %i %s without token reissue', async (operation, status, code) => {
    globalThis.fetch = jest.fn(() => response({ success: false, error: { code, message: 'wake target error' } }, status)) as jest.Mock;

    const request = operation === 'list'
      ? nunnunApi.wakeTarget.list()
      : operation === 'upsert'
      ? nunnunApi.wakeTarget.upsert('월요일, 07:30')
      : nunnunApi.wakeTarget.remove('MONDAY');
    await expect(request).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringMatching(/\/auth\/reissue$/), expect.anything());
  });
});
