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

const expired = () =>
  response(
    {
      success: false,
      error: { code: 'EXPIRED_JWT', message: 'Expired token.' },
    },
    401,
  );

const success = <T,>(data: T) => response({ success: true, data });

class TestFormData {
  parts: Array<Record<string, unknown>> = [];

  append(fieldName: string, value: Record<string, unknown>) {
    this.parts.push({ fieldName, ...value });
  }
}

describe('API client access token refresh', () => {
  let storedTokens: Record<string, string | null>;

  beforeEach(() => {
    jest.clearAllMocks();
    storedTokens = {
      [ACCESS_TOKEN_KEY]: 'old-access',
      [REFRESH_TOKEN_KEY]: 'old-refresh',
    };
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(storedTokens[key] ?? null),
    );
    (AsyncStorage.setItem as jest.Mock).mockImplementation(
      (key: string, value: string) => {
        storedTokens[key] = value;
        return Promise.resolve();
      },
    );
    (AsyncStorage.removeItem as jest.Mock).mockImplementation((key: string) => {
      storedTokens[key] = null;
      return Promise.resolve();
    });
  });

  it('does not refresh a successful request', async () => {
    globalThis.fetch = jest.fn(() => success({ groups: [] })) as jest.Mock;

    await expect(nunnunApi.group.list()).resolves.toEqual({ groups: [] });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('rotates tokens and retries an expired request once', async () => {
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(expired)
      .mockImplementationOnce(() =>
        success({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      )
      .mockImplementationOnce(() => success({ groups: [] })) as jest.Mock;

    await expect(nunnunApi.group.list()).resolves.toEqual({ groups: [] });

    expect(fetch).toHaveBeenCalledTimes(3);
    expect((fetch as jest.Mock).mock.calls[1][0]).toMatch(/\/auth\/reissue$/);
    expect((fetch as jest.Mock).mock.calls[1][1].body).toBe(
      JSON.stringify({ refreshToken: 'old-refresh' }),
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      ACCESS_TOKEN_KEY,
      'new-access',
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      REFRESH_TOKEN_KEY,
      'new-refresh',
    );
    expect((fetch as jest.Mock).mock.calls[2][1].headers.Authorization).toBe(
      'Bearer new-access',
    );
  });

  it('does not refresh INVALID_JWT or network failures', async () => {
    globalThis.fetch = jest.fn(() =>
      response(
        {
          success: false,
          error: { code: 'INVALID_JWT', message: 'Invalid token.' },
        },
        401,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 401,
      code: 'INVALID_JWT',
    });
    expect(fetch).toHaveBeenCalledTimes(1);

    globalThis.fetch = jest.fn(() => Promise.reject(new Error('offline')));
    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 0,
      code: 'NETWORK_ERROR',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('clears only auth tokens when refresh is rejected', async () => {
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(expired)
      .mockImplementationOnce(() =>
        response(
          {
            success: false,
            error: {
              code: 'EXPIRED_REFRESH_TOKEN',
              message: 'Expired refresh token.',
            },
          },
          401,
        ),
      ) as jest.Mock;

    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 401,
      code: 'EXPIRED_REFRESH_TOKEN',
    });
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('does not call reissue without a stored refresh token', async () => {
    storedTokens[REFRESH_TOKEN_KEY] = null;
    globalThis.fetch = jest.fn(expired) as jest.Mock;

    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(2);
  });

  it('never refreshes again when the one retry is also unauthorized', async () => {
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(expired)
      .mockImplementationOnce(() =>
        success({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      )
      .mockImplementationOnce(expired) as jest.Mock;

    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 401,
      code: 'EXPIRED_JWT',
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(
      (fetch as jest.Mock).mock.calls.filter(([url]) =>
        String(url).endsWith('/auth/reissue'),
      ),
    ).toHaveLength(1);
  });

  it('single-flights refresh for three concurrent expired requests', async () => {
    const originalAttempts = new Map<string, number>();
    globalThis.fetch = jest.fn((url: string) => {
      if (url.endsWith('/auth/reissue')) {
        return success({
          accessToken: 'shared-access',
          refreshToken: 'shared-refresh',
        });
      }
      const attempts = (originalAttempts.get(url) ?? 0) + 1;
      originalAttempts.set(url, attempts);
      return attempts === 1 ? expired() : success(url.endsWith('/groups') ? { groups: [] } : {});
    }) as jest.Mock;

    await expect(
      Promise.all([
        nunnunApi.group.list(),
        nunnunApi.me.getToday(),
        nunnunApi.me.getStats(),
      ]),
    ).resolves.toHaveLength(3);

    const calls = (fetch as jest.Mock).mock.calls;
    expect(calls.filter(([url]) => String(url).endsWith('/auth/reissue'))).toHaveLength(1);
    expect(calls).toHaveLength(7);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    calls
      .filter(([url]) => !String(url).endsWith('/auth/reissue'))
      .slice(3)
      .forEach(([, request]) => {
        expect(request.headers.Authorization).toBe('Bearer shared-access');
      });
  });

  it('rebuilds multipart data and uses the new token for proof retry', async () => {
    (globalThis as unknown as { FormData: typeof FormData }).FormData =
      TestFormData as unknown as typeof FormData;
    globalThis.fetch = jest
      .fn()
      .mockImplementationOnce(expired)
      .mockImplementationOnce(() =>
        success({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      )
      .mockImplementationOnce(() => success({ pose_match_result: 'SUCCESS' })) as jest.Mock;

    await nunnunApi.wake.uploadProof(31, '/cache/photo.jpg');

    const firstRequest = (fetch as jest.Mock).mock.calls[0][1];
    const retriedRequest = (fetch as jest.Mock).mock.calls[2][1];
    expect(firstRequest.body).toBeInstanceOf(TestFormData);
    expect(retriedRequest.body).toBeInstanceOf(TestFormData);
    expect(retriedRequest.body).not.toBe(firstRequest.body);
    expect(retriedRequest.headers.Authorization).toBe('Bearer new-access');
    expect(firstRequest.headers).not.toHaveProperty('Content-Type');
    expect(retriedRequest.headers).not.toHaveProperty('Content-Type');
  });
});
