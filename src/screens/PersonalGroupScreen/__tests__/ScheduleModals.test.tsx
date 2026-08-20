import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AddScheduleMethodModal from '../components/AddScheduleMethodModal';
import ManualScheduleSheet from '../components/ManualScheduleSheet';

const pressText = (root: ReactTestRenderer.ReactTestInstance, label: string) => {
  const text = root.findAllByType(Text).find(node => node.props.children === label);
  if (!text) throw new Error(`Text not found: ${label}`);
  let pressable = text.parent;
  while (pressable && typeof pressable.props.onPress !== 'function') {
    pressable = pressable.parent;
  }
  if (!pressable) throw new Error(`Pressable not found: ${label}`);
  pressable.props.onPress();
};

describe('PersonalGroup schedule modals', () => {
  it('shows only manual and album input methods', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(
        <AddScheduleMethodModal
          visible
          onClose={jest.fn()}
          onConfirmManual={jest.fn()}
        />,
      );
    });

    const labels = renderer.root
      .findAllByType(Text)
      .map(node => node.props.children)
      .filter(value => typeof value === 'string');

    expect(labels.filter(label => label.endsWith('할게요'))).toEqual([
      '수동으로 추가할게요',
      '앨범에서 업로드할게요',
    ]);
  });

  it('opens the manual flow through the selected method confirmation', async () => {
    const onConfirmManual = jest.fn();
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(
        <AddScheduleMethodModal
          visible
          onClose={jest.fn()}
          onConfirmManual={onConfirmManual}
        />,
      );
    });

    act(() => pressText(renderer.root, '확인'));

    expect(onConfirmManual).toHaveBeenCalledTimes(1);
  });

  it('submits all backend fixed-schedule fields', async () => {
    const onConfirm = jest.fn(() => Promise.resolve(true));
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(() => {
      renderer = ReactTestRenderer.create(
        <ManualScheduleSheet
          visible
          onClose={jest.fn()}
          onConfirm={onConfirm}
        />,
      );
    });

    const inputs = renderer.root.findAllByType(TextInput);
    act(() => {
      inputs[0].props.onChangeText('알고리즘');
      pressText(renderer.root, '수');
      inputs[1].props.onChangeText('09:00');
      inputs[2].props.onChangeText('10:30');
    });
    await act(async () => {
      const confirm = renderer.root
        .findAllByType(TouchableOpacity)
        .find(node =>
          node.findAllByType(Text).some(text => text.props.children === '확인'),
        );
      await confirm?.props.onPress();
    });

    expect(onConfirm).toHaveBeenCalledWith({
      title: '알고리즘',
      dayOfWeek: 'WEDNESDAY',
      startTime: '09:00',
      endTime: '10:30',
    });
  });
});
