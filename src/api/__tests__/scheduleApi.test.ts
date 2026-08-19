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

describe('fixed schedule CRUD API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('gets and parses the backend schedule array', async () => {
    const schedules = [{ id: 1, title: 'Algorithms', dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '10:30:00' }];
    globalThis.fetch = jest.fn(() => response({ success: true, data: schedules })) as jest.Mock;
    await expect(nunnunApi.schedule.list()).resolves.toEqual(schedules);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/me\/fixed-schedules$/), expect.objectContaining({ method: 'GET', headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }));
  });

  it('parses an empty schedule array', async () => {
    globalThis.fetch = jest.fn(() => response({ success: true, data: [] })) as jest.Mock;
    await expect(nunnunApi.schedule.list()).resolves.toEqual([]);
  });

  it('creates with camelCase weekday and LocalTime fields', async () => {
    const input = { title: 'Algorithms', dayOfWeek: 'MONDAY' as const, startTime: '09:00', endTime: '10:30' };
    const created = { id: 1, ...input, startTime: '09:00:00', endTime: '10:30:00' };
    globalThis.fetch = jest.fn(() => response({ success: true, data: created }, 201)) as jest.Mock;
    await expect(nunnunApi.schedule.create(input)).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/me\/fixed-schedules$/), expect.objectContaining({ method: 'POST', body: JSON.stringify(input), headers: expect.objectContaining({ Authorization: 'Bearer access-token', 'Content-Type': 'application/json' }) }));
  });

  it('patches only supplied fields at the schedule id path', async () => {
    const updated = { id: 1, title: 'New', dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '10:30:00' };
    globalThis.fetch = jest.fn(() => response({ success: true, data: updated })) as jest.Mock;
    await expect(nunnunApi.schedule.update(1, { title: 'New' })).resolves.toEqual(updated);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/me\/fixed-schedules\/1$/), expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ title: 'New' }), headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }));
  });

  it('deletes by id and parses null data', async () => {
    globalThis.fetch = jest.fn(() => response({ success: true, data: null })) as jest.Mock;
    await expect(nunnunApi.schedule.remove(1)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/me\/fixed-schedules\/1$/), expect.objectContaining({ method: 'DELETE', body: undefined, headers: expect.objectContaining({ Authorization: 'Bearer access-token' }) }));
  });

  it.each([
    ['list', 401, 'UNAUTHORIZED'],
    ['create', 400, 'VALIDATION_ERROR'],
    ['create', 400, 'INVALID_REQUEST'],
    ['create', 400, 'INVALID_FIXED_SCHEDULE_TIME'],
    ['update', 404, 'FIXED_SCHEDULE_NOT_FOUND'],
    ['remove', 401, 'UNAUTHORIZED'],
    ['remove', 404, 'FIXED_SCHEDULE_NOT_FOUND'],
  ] as const)('surfaces %s %i %s without token reissue', async (operation, status, code) => {
    globalThis.fetch = jest.fn(() => response({ success: false, error: { code, message: 'schedule error' } }, status)) as jest.Mock;
    const input = { title: 'Class', dayOfWeek: 'MONDAY' as const, startTime: '09:00', endTime: '10:00' };
    const request = operation === 'list'
      ? nunnunApi.schedule.list()
      : operation === 'create'
      ? nunnunApi.schedule.create(input)
      : operation === 'update'
      ? nunnunApi.schedule.update(1, { title: 'New' })
      : nunnunApi.schedule.remove(1);
    await expect(request).rejects.toMatchObject({ status, code });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringMatching(/\/auth\/reissue$/), expect.anything());
  });
});
