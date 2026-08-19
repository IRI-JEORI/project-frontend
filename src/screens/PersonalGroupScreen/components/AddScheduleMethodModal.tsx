import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import { checkSvg } from '../../../assets/icons/mypageIcons';
import { colors } from '../../../theme/tokens';

export type ScheduleInputMethod = 'MANUAL' | 'ALBUM' | 'CALENDAR';

export interface AddScheduleMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmManual: () => void;
}

const METHOD_OPTIONS: { key: ScheduleInputMethod; label: string }[] = [
  { key: 'MANUAL', label: '수동으로 추가할게요' },
  { key: 'ALBUM', label: '앨범에서 업로드할게요' },
  { key: 'CALENDAR', label: '캘린더를 연동할게요' },
];

const AddScheduleMethodModal = ({
  visible,
  onClose,
  onConfirmManual,
}: AddScheduleMethodModalProps) => {
  const [selected, setSelected] = useState<ScheduleInputMethod>('MANUAL');

  const handleConfirm = () => {
    if (selected === 'MANUAL') {
      onConfirmManual();
      return;
    }
    Alert.alert('준비 중이에요', '이 입력 방식은 다음 업데이트에서 지원할 예정이에요.');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>입력 방식을 선택해주세요</Text>
          <Text style={styles.subtitle}>쉽게 시간표를 추가할 수 있어요</Text>
          <View style={styles.options}>
            {METHOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.option}
                onPress={() => setSelected(option.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                <View
                  style={[
                    styles.checkbox,
                    selected === option.key && styles.checkboxSelected,
                  ]}
                >
                  {selected === option.key && (
                    <Icon xml={checkSvg} size={20} color={colors.black} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  options: {
    marginTop: 32,
    gap: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  confirmButton: {
    marginTop: 32,
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

export default AddScheduleMethodModal;
