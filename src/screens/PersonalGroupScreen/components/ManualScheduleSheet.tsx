import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

export type ManualScheduleTarget = 'FIXED' | 'DND';

export interface ManualScheduleSheetProps {
  visible: boolean;
  target: ManualScheduleTarget;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

const COPY: Record<ManualScheduleTarget, { subtitle: string; placeholder: string }> = {
  FIXED: {
    subtitle: '요일과 시간, 이름을 순서대로 입력하세요',
    placeholder: '예) 월요일, 오전 8시, 스터디',
  },
  DND: {
    subtitle: '요일과 시간을 순서대로 입력하세요',
    placeholder: '예) 월요일, 08:00~11:00',
  },
};

const ManualScheduleSheet = ({ visible, target, onClose, onConfirm }: ManualScheduleSheetProps) => {
  const [value, setValue] = useState('');
  const copy = COPY[target];

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onConfirm(trimmed);
    setValue('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>일정 정보를 입력해주세요</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={copy.placeholder}
            placeholderTextColor={colors.grayBorder}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmLabel}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 40,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grayBorder,
    marginTop: 6,
  },
  input: {
    marginTop: 36,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.black,
  },
  confirmButton: {
    marginTop: 28,
    height: 65,
    borderRadius: 16,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ManualScheduleSheet;
