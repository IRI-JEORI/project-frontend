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

describe('DND window API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets the authenticated users windows and parses an empty list', async () => {
    globalThis.fetch = jest.fn(() => response({ success: true, data: { windows: [] } })) as jest.Mock;
    await expect(nunnunApi.dnd.list()).resolves.toEqual({ windows: [] });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/dnd-windows$/),
      expect.objectContaining({ method: 'GET', headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }),
    );
  });

  it('creates a Korean weekday HH:mm range and parses the response', async () => {
    const created = { id: 10, day_of_week: 'MONDAY', start_time: '08:00', end_time: '11:00', display_text: '월요일, 08:00~11:00' };
    globalThis.fetch = jest.fn(() => response({ success: true, data: created })) as jest.Mock;
    await expect(nunnunApi.dnd.create('월요일, 08:00~11:00')).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/dnd-windows$/),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ text: '월요일, 08:00~11:00' }), headers: expect.objectContaining({ Authorization: 'Bearer access-token', 'Content-Type': 'application/json' }) }),
    );
  });

  it('deletes only the id in the path and parses null data', async () => {
    globalThis.fetch = jest.fn(() => response({ success: true, data: null })) as jest.Mock;
    await expect(nunnunApi.dnd.remove(10)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me\/dnd-windows\/10$/),
      expect.objectContaining({ method: 'DELETE', body: undefined, headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }),
    );
  });

  it.each([
    ['list', 401, 'UNAUTHORIZED'],
    ['create', 400, 'INVALID_DND_FORMAT'],
    ['create', 400, 'INVALID_TIME_RANGE'],
    ['create', 409, 'DUPLICATE_RESOURCE'],
    ['create', 404, 'USER_NOT_FOUND'],
    ['remove', 401, 'UNAUTHORIZED'],
    ['remove', 404, 'RESOURCE_NOT_FOUND'],
  ] as const)('surfaces %s %i %s without token reissue', async (operation, status, code) => {
    globalThis.fetch = jest.fn(() => response({ success: false, error: { code, message: 'DND error' } }, status)) as jest.Mock;
    const request = operation === 'list'
      ? nunnunApi.dnd.list()
      : operation === 'create'
      ? nunnunApi.dnd.create('월요일, 08:00~11:00')
      : nunnunApi.dnd.remove(10);
    await expect(request).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringMatching(/\/auth\/reissue$/), expect.anything());
  });
});
