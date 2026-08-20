import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { RootStackParamList } from '../../../App';
import { nunnunApi } from '../../api';
import { PhotoAnalysisSuccessScreen } from '../PhotoAnalysisSuccessScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../api', () => ({
  nunnunApi: {
    group: { list: jest.fn() },
    wake: { shareProof: jest.fn() },
  },
}));

jest.mock('../../assets/images/pose-result-ring-track.svg', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');
  return (props: object) => ReactModule.createElement(View, props);
});

jest.mock('../../assets/images/pose-result-ring-progress.svg', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');
  return (props: object) => ReactModule.createElement(View, props);
});

jest.mock('../../assets/images/group-selected-check.svg', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');
  return (props: object) => ReactModule.createElement(View, props);
});

const backendParams: RootStackParamList['PhotoAnalysisSuccess'] = {
  photoPath: '/cache/photo.jpg',
  recipientName: '눈눈',
  photographer: 'jiwoo',
  attempt: 1,
  requestId: 31,
  groupId: 2,
  verificationMode: 'wake-proof',
  proofResult: {
    wake_request_id: 31,
    attempt_no: 1,
    pose_match_score: 95,
    pose_match_result: 'SUCCESS',
    request_status: 'VERIFIED',
    can_retry: false,
    remaining_attempts: 1,
  },
};

const createScreen = async (
  params: RootStackParamList['PhotoAnalysisSuccess'] = backendParams,
) => {
  const navigation = { reset: jest.fn(), replace: jest.fn() };
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await act(() => {
    renderer = ReactTestRenderer.create(
      <PhotoAnalysisSuccessScreen
        navigation={navigation as never}
        route={{ key: 'success-test', name: 'PhotoAnalysisSuccess', params } as never}
      />,
    );
  });
  return { navigation, renderer };
};

const showSheet = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1200);
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('PhotoAnalysisSuccess backend sharing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.mocked(nunnunApi.group.list).mockResolvedValue({
      groups: [
        { id: 2, type: 'WAKE', name: '같은 이름', status: 'ACTIVE' },
        { id: 5, type: 'WAKE', name: '같은 이름', status: 'ACTIVE' },
        { id: 9, type: 'ROOMMATE', name: '룸메이트', status: 'ACTIVE' },
      ],
    });
    jest.mocked(nunnunApi.wake.shareProof).mockResolvedValue({ group_ids: [2, 5] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads real WAKE groups, defaults the original group, and does not skip the sheet', async () => {
    const { navigation, renderer } = await createScreen();
    await showSheet();

    expect(nunnunApi.group.list).toHaveBeenCalledTimes(1);
    expect(navigation.reset).not.toHaveBeenCalled();
    const options = renderer.root.findAllByType(TouchableOpacity);
    expect(options.filter(node => node.props.accessibilityLabel === '룸메이트 공유')).toHaveLength(0);
    const sameNameOptions = options.filter(
      node => node.props.accessibilityLabel === '같은 이름 공유',
    );
    expect(sameNameOptions).toHaveLength(2);
    expect(sameNameOptions[0].props.accessibilityState).toEqual({ checked: true });
    expect(sameNameOptions[0].props.disabled).toBe(true);
    expect(sameNameOptions[1].props.accessibilityState).toEqual({ checked: false });
  });

  it('selects by group id and shares before completion navigation', async () => {
    const { navigation, renderer } = await createScreen();
    await showSheet();
    const sameNameOptions = renderer.root
      .findAllByType(TouchableOpacity)
      .filter(node => node.props.accessibilityLabel === '같은 이름 공유');
    act(() => sameNameOptions[1].props.onPress());
    await act(async () => {
      await renderer.root.findByProps({ accessibilityLabel: '공유할 그룹 확인' }).props.onPress();
    });

    expect(nunnunApi.wake.shareProof).toHaveBeenCalledWith(31, [2, 5]);
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'WakeGroupDetail', params: { groupId: 2 } },
      ],
    });
  });

  it('keeps the sheet open and allows retry when sharing fails', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest.mocked(nunnunApi.wake.shareProof).mockRejectedValue(new Error('failed'));
    const { navigation, renderer } = await createScreen();
    await showSheet();
    await act(async () => {
      await renderer.root.findByProps({ accessibilityLabel: '공유할 그룹 확인' }).props.onPress();
    });

    expect(alert).toHaveBeenCalledWith(
      '공유 실패',
      '인증 정보를 공유하지 못했어요. 다시 시도해주세요.',
    );
    expect(navigation.reset).not.toHaveBeenCalled();
    expect(renderer.root.findAllByType(Text).map(node => node.props.children))
      .toContain('공유할 그룹을 선택해주세요');
    alert.mockRestore();
  });

  it('disables confirmation when the original WAKE group is unavailable', async () => {
    jest.mocked(nunnunApi.group.list).mockResolvedValue({
      groups: [{ id: 9, type: 'ROOMMATE', name: '룸메이트', status: 'ACTIVE' }],
    });
    const { renderer } = await createScreen();
    await showSheet();
    const confirm = renderer.root.findByProps({ accessibilityLabel: '공유할 그룹 확인' });
    expect(confirm.props.disabled).toBe(true);
  });

  it('keeps the existing demo completion path independent from backend groups', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('true');
    const { navigation } = await createScreen({
      ...backendParams,
      requestId: undefined,
      groupId: undefined,
      verificationMode: undefined,
      proofResult: undefined,
    });
    await showSheet();
    expect(nunnunApi.group.list).not.toHaveBeenCalled();
    expect(navigation.replace).toHaveBeenCalledWith(
      'WaitingForMembers',
      expect.any(Object),
    );
  });
});
