import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { DayOfWeek } from '../../../api/types';
import { colors } from '../../../theme/tokens';

export interface DndWindowSheetProps {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (displayText: string) => Promise<boolean>;
}

const TIME_PATTERN = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
const DAYS: Array<{ value: DayOfWeek; label: string; displayLabel: string }> = [
  { value: 'MONDAY', label: '월', displayLabel: '월요일' },
  { value: 'TUESDAY', label: '화', displayLabel: '화요일' },
  { value: 'WEDNESDAY', label: '수', displayLabel: '수요일' },
  { value: 'THURSDAY', label: '목', displayLabel: '목요일' },
  { value: 'FRIDAY', label: '금', displayLabel: '금요일' },
  { value: 'SATURDAY', label: '토', displayLabel: '토요일' },
  { value: 'SUNDAY', label: '일', displayLabel: '일요일' },
];

const DndWindowSheet = ({
  visible,
  submitting = false,
  onClose,
  onConfirm,
}: DndWindowSheetProps) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('MONDAY');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleConfirm = async () => {
    const start = startTime.trim();
    const end = endTime.trim();
    if (!TIME_PATTERN.test(start) || !TIME_PATTERN.test(end)) {
      Alert.alert('입력 확인', '시간을 HH:mm 형식으로 입력해주세요.');
      return;
    }
    if (start >= end) {
      Alert.alert('입력 확인', '시작 시간은 종료 시간보다 빨라야 해요.');
      return;
    }
    const day = DAYS.find(candidate => candidate.value === dayOfWeek)!;
    if (await onConfirm(`${day.displayLabel}, ${start}~${end}`)) {
      setDayOfWeek('MONDAY');
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>방해금지 시간을 입력해주세요</Text>
          <Text style={styles.subtitle}>요일과 시작 및 종료 시간을 입력하세요</Text>
          <View style={styles.dayOptions}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day.value}
                style={[styles.dayOption, dayOfWeek === day.value && styles.dayOptionSelected]}
                onPress={() => setDayOfWeek(day.value)}
                disabled={submitting}
              >
                <Text style={[styles.dayOptionLabel, dayOfWeek === day.value && styles.dayOptionLabelSelected]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.timeRow}>
            <TextInput
              accessibilityLabel="방해금지 시작 시간"
              style={[styles.input, styles.timeInput]}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="시작 09:00"
              placeholderTextColor={colors.grayBorder}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              editable={!submitting}
            />
            <Text style={styles.timeSeparator}>~</Text>
            <TextInput
              accessibilityLabel="방해금지 종료 시간"
              style={[styles.input, styles.timeInput]}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="종료 10:00"
              placeholderTextColor={colors.grayBorder}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              editable={!submitting}
            />
          </View>
          <TouchableOpacity
            accessibilityLabel="방해금지 시간 저장"
            style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
            onPress={() => handleConfirm().catch(() => undefined)}
            disabled={submitting}
          >
            <Text style={styles.confirmLabel}>{submitting ? '저장 중...' : '확인'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  backdropTouchable: { flex: 1 },
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
  title: { fontSize: 24, fontFamily: 'PretendardBold', color: colors.black },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PretendardMedium',
    color: colors.grayBorder,
    marginTop: 6,
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: 'PretendardMedium',
    color: colors.black,
  },
  dayOptions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 36 },
  dayOption: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOptionSelected: { backgroundColor: colors.red },
  dayOptionLabel: { fontSize: 14, fontFamily: 'PretendardMedium', color: colors.black },
  dayOptionLabelSelected: { color: colors.white },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 10 },
  timeInput: { flex: 1 },
  timeSeparator: { fontSize: 16, fontFamily: 'PretendardMedium', color: colors.black },
  confirmButton: {
    marginTop: 28,
    height: 65,
    borderRadius: 16,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: { fontSize: 18, fontFamily: 'PretendardSemiBold', color: colors.white },
  confirmButtonDisabled: { opacity: 0.6 },
});

export default DndWindowSheet;
