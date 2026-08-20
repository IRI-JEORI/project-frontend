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
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
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

  it('opens analysis without uploading and preserves backend params', async () => {
    const { navigation, renderer } = await createScreen();

    await press(renderer, '사진 올리기');

    expect(nunnunApi.wake.uploadProof).not.toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalledWith(
      'PhotoAnalysis',
      expect.objectContaining({
        photoPath: '/cache/photo.jpg',
        photoUri: 'file:///cache/photo.jpg',
        requestId: 31,
        groupId: 17,
        verificationMode: 'self-verify',
      }),
    );
  });

  it('opens only one analysis screen on a rapid double press', async () => {
    const { navigation, renderer } = await createScreen({
      ...baseParams,
      verificationMode: 'wake-proof',
    });

    const button = renderer.root.findByProps({ accessibilityLabel: '사진 올리기' });
    await act(async () => {
      button.props.onPress();
      button.props.onPress();
    });

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(nunnunApi.wake.uploadProof).not.toHaveBeenCalled();
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
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      '인증사진 제출 불가',
      '깨우기 요청 정보가 없어 사진을 제출할 수 없어요.',
    );
    alert.mockRestore();
  });
});
