import { API_BASE_URL, API_TIMEOUT_MS } from '../config/api';
import { tokenStorage } from './tokenStorage';
import type { ApiErrorResponse, AuthTokens } from './types';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  timeoutMs?: number;
  retryOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, body: ApiErrorResponse = {}) {
    super(body.message || `API 요청에 실패했습니다. (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code || 'UNKNOWN_API_ERROR';
    this.details = body.details;
  }
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData;

const parseResponse = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

let reissuePromise: Promise<AuthTokens> | null = null;

const reissue = async (): Promise<AuthTokens> => {
  if (reissuePromise) {
    return reissuePromise;
  }

  reissuePromise = (async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError(401, {
        code: 'UNAUTHORIZED',
        message: '로그인이 필요합니다.',
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reissue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        signal: controller.signal,
      });
      const data = (await parseResponse(response)) as
        | (Partial<AuthTokens> & ApiErrorResponse)
        | undefined;

      if (!response.ok || !data?.access_token) {
        await tokenStorage.clear();
        throw new ApiError(response.status, data);
      }

      const tokens: AuthTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken,
      };
      await tokenStorage.save(tokens);
      return tokens;
    } finally {
      clearTimeout(timeout);
    }
  })().finally(() => {
    reissuePromise = null;
  });

  return reissuePromise;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    timeoutMs = API_TIMEOUT_MS,
    retryOnUnauthorized = true,
  } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const accessToken = auth ? await tokenStorage.getAccessToken() : null;
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
    if (body !== undefined && !isFormData(body)) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData(body)
          ? body
          : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await parseResponse(response);

    if (response.status === 401 && auth && retryOnUnauthorized) {
      await reissue();
      return apiRequest<T>(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }

    if (!response.ok) {
      throw new ApiError(response.status, data as ApiErrorResponse);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, {
        code: 'REQUEST_TIMEOUT',
        message: '서버 응답 시간이 초과되었습니다.',
      });
    }
    throw new ApiError(0, {
      code: 'NETWORK_ERROR',
      message:
        '서버에 연결할 수 없습니다. 네트워크와 서버 주소를 확인해주세요.',
      details: error,
    });
  } finally {
    clearTimeout(timeout);
  }
};

export const createImageFormData = (imagePath: string) => {
  const formData = new FormData();
  const uri = imagePath.startsWith('file://')
    ? imagePath
    : `file://${imagePath}`;

  formData.append('image', {
    uri,
    type: 'image/jpeg',
    name: `nunnun-${Date.now()}.jpg`,
  } as unknown as Blob);
  return formData;
};
