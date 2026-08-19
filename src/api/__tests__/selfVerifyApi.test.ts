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

describe('self verify API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('creates a self verify request without a body and unwraps its pose', async () => {
    const created = {
      wake_request_id: 51,
      status: 'SENT',
      self_verify: true,
      pose: {
        date: '2026-08-19',
        description: '두 팔을 앞에서 X자로 교차해주세요.',
      },
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: created }, 201),
    ) as jest.Mock;

    await expect(nunnunApi.wake.startSelfVerify()).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/self-verify$/),
      expect.objectContaining({
        method: 'POST',
        body: undefined,
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
    [404, 'ACTIVE_POSE_NOT_FOUND'],
  ])('surfaces %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'self verify error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.wake.startSelfVerify()).rejects.toMatchObject({
      status,
      code,
      message: 'self verify error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});
