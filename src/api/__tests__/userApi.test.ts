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

describe('current user API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets the authenticated profile and unwraps the response', async () => {
    const profile = { id: 7, nickname: '눈눈', email: 'demo@example.com' };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: profile }),
    ) as jest.Mock;

    await expect(nunnunApi.user.getMe()).resolves.toEqual(profile);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/users\/me$/),
      expect.objectContaining({
        method: 'GET',
        body: undefined,
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [404, 'USER_NOT_FOUND'],
  ])('surfaces GET %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'profile error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.user.getMe()).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });

  it('patches only the required nickname and parses the latest profile', async () => {
    const profile = {
      id: 7,
      nickname: '새닉네임',
      email: 'demo@example.com',
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: profile }),
    ) as jest.Mock;

    await expect(
      nunnunApi.user.updateMe({ nickname: '새닉네임' }),
    ).resolves.toEqual(profile);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/users\/me$/),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ nickname: '새닉네임' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it.each([
    [400, 'VALIDATION_ERROR'],
    [401, 'UNAUTHORIZED'],
    [404, 'USER_NOT_FOUND'],
  ])('surfaces PATCH %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'update error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(
      nunnunApi.user.updateMe({ nickname: '새닉네임' }),
    ).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});
