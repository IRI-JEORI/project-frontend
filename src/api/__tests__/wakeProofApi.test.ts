import AsyncStorage from '@react-native-async-storage/async-storage';
import { nunnunApi } from '../nunnunApi';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

class TestFormData {
  private parts: Array<Record<string, unknown>> = [];

  append(fieldName: string, value: Record<string, unknown>) {
    this.parts.push({ fieldName, ...value });
  }

  getParts() {
    return this.parts;
  }
}

const response = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

describe('wake proof API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as unknown as { FormData: typeof FormData }).FormData =
      TestFormData as unknown as typeof FormData;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('access-token');
  });

  it.each([
    ['SUCCESS', true, 0],
    ['FAIL', false, 1],
  ] as const)(
    'uploads image multipart and parses a %s result',
    async (poseMatchResult, success, remainingAttempts) => {
      const proof = {
        wake_request_id: 31,
        attempt_no: 1,
        pose_match_score: success ? 91 : 42,
        pose_match_result: poseMatchResult,
        request_status: success ? 'VERIFIED' : 'SENT',
        can_retry: !success,
        remaining_attempts: remainingAttempts,
        ...(success
          ? {
              verified_at: '2026-08-19T07:35:00+09:00',
              cooldown_until: '2026-08-19T08:05:00+09:00',
              proof_expires_at: '2026-08-19T15:35:00+09:00',
            }
          : {}),
      };
      globalThis.fetch = jest.fn(() =>
        response({ success: true, data: proof }, 201),
      ) as jest.Mock;

      await expect(
        nunnunApi.wake.uploadProof(31, '/cache/photo.jpg'),
      ).resolves.toEqual(proof);

      const [, request] = (fetch as jest.Mock).mock.calls[0];
      expect((request.body as unknown as TestFormData).getParts()).toEqual([
        expect.objectContaining({
          fieldName: 'image',
          uri: 'file:///cache/photo.jpg',
          name: expect.stringMatching(/^nunnun-\d+\.jpg$/),
          type: 'image/jpeg',
        }),
      ]);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/wake-requests\/31\/proof$/),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        }),
      );
      expect(request.headers).not.toHaveProperty('Content-Type');
    },
  );

  it.each([
    [400, 'INVALID_WAKE_PROOF_IMAGE'],
    [401, 'UNAUTHORIZED'],
    [403, 'WAKE_REQUEST_ACCESS_DENIED'],
    [404, 'WAKE_REQUEST_NOT_FOUND'],
    [409, 'RETRY_EXHAUSTED'],
    [409, 'INVALID_WAKE_REQUEST_STATUS'],
    [422, 'POSE_ANALYSIS_FAILED'],
    [502, 'WAKE_PROOF_UPLOAD_FAILED'],
  ])('surfaces %i %s without token reissue', async (status, code) => {
    globalThis.fetch = jest.fn(() =>
      response({ success: false, error: { code, message: 'proof error' } }, status),
    ) as jest.Mock;

    await expect(
      nunnunApi.wake.uploadProof(31, 'content://photo/31'),
    ).rejects.toMatchObject({ status, code, message: 'proof error' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
