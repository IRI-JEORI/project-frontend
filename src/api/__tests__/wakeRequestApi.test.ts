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

describe('wake request detail API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets and unwraps every wake request detail field with JWT', async () => {
    const detail = {
      id: 31,
      group_id: 7,
      status: 'SENT',
      sender: { id: 7, nickname: '지우' },
      receiver: { id: 8, nickname: '눈눈' },
      requested_at: '2026-08-19T07:32:00+09:00',
      pose: {
        date: '2026-08-19',
        description: '두 팔을 앞에서 X자로 교차해주세요.',
      },
      attempts_used: 1,
      remaining_attempts: 1,
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: detail }),
    ) as jest.Mock;

    await expect(nunnunApi.wake.getRequest(31)).resolves.toEqual(detail);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-requests\/31$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [403, 'WAKE_REQUEST_ACCESS_DENIED'],
    [404, 'WAKE_REQUEST_NOT_FOUND'],
  ])('surfaces a %i detail error without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'request detail error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.wake.getRequest(31)).rejects.toMatchObject({
      status,
      code,
      message: 'request detail error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});
