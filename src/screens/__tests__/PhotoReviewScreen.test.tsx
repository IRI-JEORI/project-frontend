import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { RootStackParamList } from '../../../App';
import { nunnunApi } from '../../api';
import { PhotoReviewScreen } from '../PhotoReviewScreen';

jest.mock('../../api', () => ({
  ApiError: class ApiError extends Error {},
  nunnunApi: {
    wake: {
      uploadProof: jest.fn(),
    },
  },
}));

const baseParams: RootStackParamList['PhotoReview'] = {
  photoPath: '/cache/photo.jpg',
  photoUri: 'file:///cache/photo.jpg',
  memberName: '눈눈',
  recipientName: '눈눈',
  photographer: 'jiwoo' as const,
  attempt: 1,
  requestId: 31,
  groupId: 17,
  verificationMode: 'self-verify' as const,
};

const createScreen = async (params = baseParams) => {
  const navigation = {
    goBack: jest.fn(),
    replace: jest.fn(),
  };
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <PhotoReviewScreen
        navigation={navigation as never}
        route={{ key: 'PhotoReview-test', name: 'PhotoReview', params } as never}
      />,
    );
  });
  return { navigation, renderer };
};

const press = async (
  renderer: ReactTestRenderer.ReactTestRenderer,
  accessibilityLabel: string,
) => {
  await act(async () => {
    await renderer.root.findByProps({ accessibilityLabel }).props.onPress();
  });
};

describe('PhotoReviewScreen backend flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads the captured photo and preserves self-verify params on success', async () => {
    const proofResult = {
      wake_request_id: 31,
      attempt_no: 1,
      pose_match_score: 95,
      pose_match_result: 'SUCCESS' as const,
      request_status: 'VERIFIED' as const,
      remaining_attempts: 1,
      can_retry: false,
    };
    jest.mocked(nunnunApi.wake.uploadProof).mockResolvedValue(proofResult);
    const { navigation, renderer } = await createScreen();

    await press(renderer, '사진 올리기');

    expect(nunnunApi.wake.uploadProof).toHaveBeenCalledWith(
      31,
      'file:///cache/photo.jpg',
    );
    expect(navigation.replace).toHaveBeenCalledWith(
      'PhotoAnalysisSuccess',
      expect.objectContaining({
        requestId: 31,
        groupId: 17,
        verificationMode: 'self-verify',
        proofResult,
      }),
    );
  });

  it('preserves wake-proof retry params on analysis failure', async () => {
    const proofResult = {
      wake_request_id: 31,
      attempt_no: 1,
      pose_match_score: 30,
      pose_match_result: 'FAIL' as const,
      request_status: 'SENT' as const,
      remaining_attempts: 1,
      can_retry: true,
    };
    jest.mocked(nunnunApi.wake.uploadProof).mockResolvedValue(proofResult);
    const { navigation, renderer } = await createScreen({
      ...baseParams,
      verificationMode: 'wake-proof',
    });

    await press(renderer, '사진 올리기');

    expect(navigation.replace).toHaveBeenCalledWith(
      'PhotoAnalysisFailure',
      expect.objectContaining({
        attempt: 1,
        requestId: 31,
        groupId: 17,
        verificationMode: 'wake-proof',
        proofResult,
      }),
    );
  });

  it('returns to CameraCapture when retaking the photo', async () => {
    const { navigation, renderer } = await createScreen();

    await press(renderer, '사진 다시 찍기');

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(nunnunApi.wake.uploadProof).not.toHaveBeenCalled();
  });

  it('does not upload when a verification request id is missing', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const { navigation, renderer } = await createScreen({
      ...baseParams,
      requestId: undefined,
    });

    await press(renderer, '사진 올리기');

    expect(nunnunApi.wake.uploadProof).not.toHaveBeenCalled();
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      '인증사진 제출 불가',
      '깨우기 요청 정보가 없어 사진을 제출할 수 없어요.',
    );
    alert.mockRestore();
  });
});
