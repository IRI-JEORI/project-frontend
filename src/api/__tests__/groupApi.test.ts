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

describe('wake group create API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('creates a group with only its name and parses backend identifiers', async () => {
    const created = {
      id: 7,
      name: '아침 야호',
      invite_code: '8G3FE2',
      capacity: 4,
      current_members: 1,
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: created }, 201),
    ) as jest.Mock;

    await expect(nunnunApi.group.create('아침 야호')).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: '아침 야호' }),
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
    [409, 'ACTIVE_WAKE_GROUP_EXISTS'],
    [500, 'INVITE_CODE_GENERATION_FAILED'],
  ])('surfaces %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'create group error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.create('아침 야호')).rejects.toMatchObject({
      status,
      code,
      message: 'create group error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});

describe('wake group invite preview and join API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('previews an invite code through the authenticated query endpoint', async () => {
    const preview = {
      valid: true,
      reason: null,
      group_name: '아침 야호',
      current_members: 3,
      capacity: 4,
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: preview }),
    ) as jest.Mock;

    await expect(nunnunApi.group.preview('8G3FE2')).resolves.toEqual(preview);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/preview\?code=8G3FE2$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it.each([
    'INVALID_CODE',
    'GROUP_FULL',
    'ALREADY_IN_WAKE_GROUP',
    'ALREADY_MEMBER',
  ])('parses the %s preview reason without treating it as HTTP failure', async reason => {
    const preview = {
      valid: false,
      reason,
      group_name: null,
      current_members: null,
      capacity: null,
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: preview }),
    ) as jest.Mock;

    await expect(nunnunApi.group.preview('BAD001')).resolves.toEqual(preview);
  });

  it('surfaces preview 401 without token reissue', async () => {
    globalThis.fetch = jest.fn(() =>
      response(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'preview error' },
        },
        401,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.preview('8G3FE2')).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });

  it('joins with the invite code and returns the actual group id', async () => {
    const joined = { id: 7, name: '아침 야호' };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: joined }, 201),
    ) as jest.Mock;

    await expect(nunnunApi.group.join('8G3FE2')).resolves.toEqual(joined);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/join$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ invite_code: '8G3FE2' }),
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
    [409, 'ACTIVE_WAKE_GROUP_EXISTS'],
    [409, 'ALREADY_MEMBER'],
    [409, 'WAKE_GROUP_FULL'],
  ])('surfaces join %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'join error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.join('8G3FE2')).rejects.toMatchObject({
      status,
      code,
      message: 'join error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});

describe('wake group leave API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('deletes the current membership without a request body', async () => {
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: null }),
    ) as jest.Mock;

    await expect(nunnunApi.group.leave(7)).resolves.toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/7\/members\/me$/),
      expect.objectContaining({
        method: 'DELETE',
        body: undefined,
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it.each([
    [401, 'UNAUTHORIZED'],
    [403, 'FORBIDDEN'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
    [404, 'WAKE_GROUP_MEMBER_NOT_FOUND'],
  ])('surfaces leave %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'leave error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.leave(7)).rejects.toMatchObject({
      status,
      code,
      message: 'leave error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});

describe('wake group rename API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('patches the group name and parses the update response', async () => {
    const updated = { id: 7, name: '새 아침 모임' };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: updated }),
    ) as jest.Mock;

    await expect(nunnunApi.group.rename(7, '새 아침 모임')).resolves.toEqual(
      updated,
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/7$/),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ name: '새 아침 모임' }),
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
    [403, 'WAKE_GROUP_ACCESS_DENIED'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
  ])('surfaces rename %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'rename error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(
      nunnunApi.group.rename(7, '새 아침 모임'),
    ).rejects.toMatchObject({ status, code, message: 'rename error' });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/reissue$/),
      expect.anything(),
    );
  });
});

describe('group list API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('unwraps groups and sends the stored access token', async () => {
    globalThis.fetch = jest.fn(() =>
      response({
        success: true,
        data: {
          groups: [
            { id: 1, type: 'WAKE', name: '아침 야호', status: null },
          ],
        },
      }),
    ) as jest.Mock;

    await expect(nunnunApi.group.list()).resolves.toEqual({
      groups: [{ id: 1, type: 'WAKE', name: '아침 야호', status: null }],
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/groups$/),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }),
      }),
    );
  });

  it('returns an empty group list', async () => {
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: { groups: [] } }),
    ) as jest.Mock;

    await expect(nunnunApi.group.list()).resolves.toEqual({ groups: [] });
  });

  it('surfaces a 401 without attempting token reissue', async () => {
    globalThis.fetch = jest.fn(() =>
      response(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        },
        401,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.list()).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('wake group detail API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('parses members and sends JWT to the group id URL', async () => {
    const detail = {
      id: 7,
      name: '아침 야호',
      invite_code: '8G3FE2',
      capacity: 4,
      current_members: 1,
      members: [
        {
          user_id: 11,
          nickname: '눈눈',
          avatar_url: null,
          is_me: true,
          target_wake_time: '07:30',
          next_target_at: '2026-08-20T07:30:00+09:00',
          remaining_to_target: { value: 7, unit: 'HOUR' },
          state: 'NORMAL',
          actual_wake_time: null,
          proof_image_url: null,
          proof_expires_at: null,
          can_wake: false,
          block_reason: null,
          wake_available_at: null,
        },
      ],
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: detail }),
    ) as jest.Mock;

    await expect(nunnunApi.group.detail(7)).resolves.toEqual(detail);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/7$/),
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
    [403, 'WAKE_GROUP_ACCESS_DENIED'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
  ])('transforms a %i detail error without retrying', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'detail error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.group.detail(7)).rejects.toMatchObject({
      status,
      code,
      message: 'detail error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('wake request API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it('posts group and receiver ids without a request body', async () => {
    const created = {
      wake_request_id: 31,
      status: 'SENT',
      requested_at: '2026-08-19T08:30:00+09:00',
    };
    globalThis.fetch = jest.fn(() =>
      response({ success: true, data: created }, 201),
    ) as jest.Mock;

    await expect(nunnunApi.wake.wakeMember(7, 11)).resolves.toEqual(created);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/wake-groups\/7\/members\/11\/wake$/),
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
    [403, 'WAKE_GROUP_SENDER_NOT_MEMBER'],
    [404, 'WAKE_GROUP_NOT_FOUND'],
    [409, 'WAKE_BLOCKED_DND'],
    [409, 'WAKE_COOLDOWN'],
  ])('transforms a %i wake error without retrying', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response(
        { success: false, error: { code, message: 'wake error' } },
        status,
      ),
    ) as jest.Mock;

    await expect(nunnunApi.wake.wakeMember(7, 11)).rejects.toMatchObject({
      status,
      code,
      message: 'wake error',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
