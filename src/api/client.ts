import { API_BASE_URL } from './config';
import { getAccessToken } from './tokenStorage';

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | undefined>;
}

const buildQuery = (query?: RequestOptions['query']) => {
  if (!query) {
    return '';
  }
  const entries = Object.entries(query).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return '';
  }
  const params = new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)]),
  );
  return `?${params.toString()}`;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, auth = true, query } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = await getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    const code = payload?.code ?? payload?.error;
    const message = payload?.message ?? `요청에 실패했어요 (${response.status})`;
    throw new ApiError(response.status, code, message);
  }

  return payload as T;
};

export const apiUpload = async <T>(
  path: string,
  field: string,
  file: { uri: string; name: string; type: string },
): Promise<T> => {
  const token = await getAccessToken();
  const formData = new FormData();
  // @ts-expect-error React Native FormData accepts this file-descriptor shape
  formData.append(field, { uri: file.uri, name: file.name, type: file.type });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    const code = payload?.code ?? payload?.error;
    const message = payload?.message ?? `업로드에 실패했어요 (${response.status})`;
    throw new ApiError(response.status, code, message);
  }

  return payload as T;
};
