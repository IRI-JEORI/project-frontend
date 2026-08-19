import AsyncStorage from '@react-native-async-storage/async-storage';
import { nunnunApi } from '../nunnunApi';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const ACCESS_TOKEN_KEY = '@nunnun/auth/access-token';
const REFRESH_TOKEN_KEY = '@nunnun/auth/refresh-token';

const response = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

const success = <T,>(data: T) => response({ success: true, data });

describe('logout API lifecycle', () => {
  let storage: Record<string, string | null>;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = {
      [ACCESS_TOKEN_KEY]: 'access-token',
      [REFRESH_TOKEN_KEY]: 'refresh-token',
    };
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(storage[key] ?? null),
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      (key: string, value: string) => {
        storage[key] = value;
        return Promise.resolve();
      },
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation((key: string) => {
      storage[key] = null;
      return Promise.resolve();
    });
  });

  it('sends the current refresh token without Authorization and clears auth tokens', async () => {
    globalThis.fetch = jest.fn(() => success(null)) as jest.Mock;

    await nunnunApi.auth.logout();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/logout$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ refreshToken: 'refresh-token' }),
      }),
    );
    expect((fetch as jest.Mock).mock.calls[0][1].headers).not.toHaveProperty(
      'Authorization',
    );
    expect(storage[ACCESS_TOKEN_KEY]).toBeNull();
    expect(storage[REFRESH_TOKEN_KEY]).toBeNull();
  });

  it('uses the rotated refresh token for logout', async () => {
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        success({ accessToken: 'rotated-access', refreshToken: 'rotated-refresh' }),
      )
      .mockImplementationOnce(() => success(null)) as jest.Mock;

    await nunnunApi.auth.reissue('refresh-token');
    await nunnunApi.auth.logout();

    expect((fetch as jest.Mock).mock.calls[1][1].body).toBe(
      JSON.stringify({ refreshToken: 'rotated-refresh' }),
    );
    expect(storage[ACCESS_TOKEN_KEY]).toBeNull();
    expect(storage[REFRESH_TOKEN_KEY]).toBeNull();
  });

  it.each(['INVALID_REFRESH_TOKEN', 'EXPIRED_REFRESH_TOKEN'])(
    'finishes local logout for %s',
    async code => {
      globalThis.fetch = jest.fn(() =>
        response({ success: false, error: { code, message: code } }, 401),
      ) as jest.Mock;

      await expect(nunnunApi.auth.logout()).resolves.toBeUndefined();
      expect(storage[ACCESS_TOKEN_KEY]).toBeNull();
      expect(storage[REFRESH_TOKEN_KEY]).toBeNull();
    },
  );

  it.each([
    ['network', () => Promise.reject(new Error('offline'))],
    [
      'server',
      () =>
        response(
          {
            success: false,
            error: { code: 'INTERNAL_SERVER_ERROR', message: 'server error' },
          },
          500,
        ),
    ],
  ] as const)('keeps tokens after a %s failure', async (_name, failure) => {
    globalThis.fetch = jest.fn(failure) as jest.Mock;

    await expect(nunnunApi.auth.logout()).rejects.toBeDefined();
    expect(storage[ACCESS_TOKEN_KEY]).toBe('access-token');
    expect(storage[REFRESH_TOKEN_KEY]).toBe('refresh-token');
  });

  it('single-flights duplicate logout calls', async () => {
    globalThis.fetch = jest.fn(() => success(null)) as jest.Mock;

    await Promise.all([nunnunApi.auth.logout(), nunnunApi.auth.logout()]);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('waits for pending refresh and revokes its latest token without resurrection', async () => {
    let resolveRefresh: ((value: Response) => void) | undefined;
    const pendingRefresh = new Promise<Response>(resolve => {
      resolveRefresh = resolve;
    });
    globalThis.fetch = jest.fn((url: string) => {
      if (url.endsWith('/groups')) {
        return response(
          {
            success: false,
            error: { code: 'EXPIRED_JWT', message: 'expired' },
          },
          401,
        );
      }
      if (url.endsWith('/auth/reissue')) {
        return pendingRefresh;
      }
      if (url.endsWith('/auth/logout')) {
        return success(null);
      }
      throw new Error(`Unexpected URL: ${url}`);
    }) as jest.Mock;

    const originalRequest = nunnunApi.group.list();
    for (let attempt = 0; attempt < 10; attempt += 1) {
      if (
        (fetch as jest.Mock).mock.calls.some(([url]) =>
          String(url).endsWith('/auth/reissue'),
        )
      ) {
        break;
      }
      await Promise.resolve();
    }
    const logout = nunnunApi.auth.logout();

    resolveRefresh?.(
      await success({
        accessToken: 'rotated-access',
        refreshToken: 'rotated-refresh',
      }),
    );

    await expect(originalRequest).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    await expect(logout).resolves.toBeUndefined();
    const logoutCall = (fetch as jest.Mock).mock.calls.find(([url]) =>
      String(url).endsWith('/auth/logout'),
    );
    expect(logoutCall?.[1].body).toBe(
      JSON.stringify({ refreshToken: 'rotated-refresh' }),
    );
    expect(storage[ACCESS_TOKEN_KEY]).toBeNull();
    expect(storage[REFRESH_TOKEN_KEY]).toBeNull();
  });
});
