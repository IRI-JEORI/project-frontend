import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { ApiError, nunnunApi, tokenStorage } from '../api';
import type { DayOfWeek, FixedSchedule } from '../api/types';
import { Colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const TIME_PATTERN = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
const DAYS: Array<{ value: DayOfWeek; label: string }> = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'FixedSchedules'>;

const scheduleLoadErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '고정 일정을 불러오지 못했어요.';
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '고정 일정을 불러오지 못했어요.';
  }
};

const scheduleMutationErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '고정 일정을 저장하지 못했어요.';
  switch (error.code) {
    case 'VALIDATION_ERROR':
    case 'INVALID_REQUEST':
      return '제목, 요일과 시간을 다시 확인해주세요.';
    case 'INVALID_FIXED_SCHEDULE_TIME':
      return '시작 시간은 종료 시간보다 빨라야 해요.';
    case 'FIXED_SCHEDULE_NOT_FOUND':
      return '일정을 찾을 수 없거나 내 일정이 아니에요.';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '고정 일정을 저장하지 못했어요.';
  }
};

const scheduleDeleteErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.code === 'FIXED_SCHEDULE_NOT_FOUND') {
    return '이미 삭제되었거나 내 일정이 아닌 항목이에요.';
  }
  return scheduleMutationErrorMessage(error).replace('저장', '삭제');
};

const shortTime = (time: string) => time.slice(0, 5);

export const FixedScheduleScreen = ({ navigation }: Props) => {
  const [schedules, setSchedules] = useState<FixedSchedule[]>([]);
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('MONDAY');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const mutationInFlightRef = useRef(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  const loadSchedules = useCallback(async () => {
    const accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) {
      setSchedules([]);
      setError('데모 사용자를 선택해주세요.');
      return;
    }
    setSchedules(await nunnunApi.schedule.list());
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadSchedules()
        .catch(loadError => {
          if (active) setError(scheduleLoadErrorMessage(loadError));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [loadSchedules]),
  );

  const validInput =
    title.trim().length > 0 &&
    title.trim().length <= 100 &&
    TIME_PATTERN.test(startTime.trim()) &&
    TIME_PATTERN.test(endTime.trim()) &&
    startTime.trim() < endTime.trim();

  const resetForm = () => {
    setTitle('');
    setDayOfWeek('MONDAY');
    setStartTime('');
    setEndTime('');
    setEditingId(null);
  };

  const saveSchedule = async () => {
    if (!validInput || mutationInFlightRef.current) return;
    const input = {
      title: title.trim(),
      dayOfWeek,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    };
    mutationInFlightRef.current = true;
    setSaving(true);
    try {
      if (editingId === null) {
        await nunnunApi.schedule.create(input);
      } else {
        await nunnunApi.schedule.update(editingId, input);
      }
      await loadSchedules();
      resetForm();
    } catch (saveError) {
      Alert.alert('저장 실패', scheduleMutationErrorMessage(saveError));
    } finally {
      mutationInFlightRef.current = false;
      setSaving(false);
    }
  };

  const editSchedule = (schedule: FixedSchedule) => {
    setEditingId(schedule.id);
    setTitle(schedule.title);
    setDayOfWeek(schedule.dayOfWeek);
    setStartTime(shortTime(schedule.startTime));
    setEndTime(shortTime(schedule.endTime));
  };

  const deleteSchedule = async (id: number) => {
    if (mutationInFlightRef.current) return;
    mutationInFlightRef.current = true;
    setDeletingId(id);
    try {
      await nunnunApi.schedule.remove(id);
      await loadSchedules();
      if (editingId === id) resetForm();
    } catch (deleteError) {
      Alert.alert('삭제 실패', scheduleDeleteErrorMessage(deleteError));
    } finally {
      mutationInFlightRef.current = false;
      setDeletingId(null);
    }
  };

  const confirmDelete = (schedule: FixedSchedule) => {
    Alert.alert('고정 일정 삭제', `${schedule.title} 일정을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteSchedule(schedule.id).catch(() => undefined),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityLabel="설정으로 돌아가기"
          accessibilityRole="button"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { left: 28 * scale, top: 17 * scale }]}
        >
          <Image
            resizeMode="contain"
            source={require('../assets/images/chevron-left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { top: 22 * scale }]}>고정 일정</Text>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={[styles.scroll, { top: 62 * scale }]}
        >
          <Text style={styles.sectionTitle}>
            {editingId === null ? '새 일정' : '일정 수정'}
          </Text>
          <TextInput
            accessibilityLabel="일정 제목"
            editable={!saving && deletingId === null}
            maxLength={100}
            onChangeText={setTitle}
            placeholder="일정 제목"
            placeholderTextColor={Colors.textGray}
            style={styles.titleInput}
            value={title}
          />
          <View style={styles.dayOptions}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: dayOfWeek === day.value }}
                activeOpacity={0.8}
                disabled={saving || deletingId !== null}
                onPress={() => setDayOfWeek(day.value)}
                style={[
                  styles.dayOption,
                  dayOfWeek === day.value && styles.dayOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayOptionText,
                    dayOfWeek === day.value && styles.dayOptionTextSelected,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.timeRow}>
            <TextInput
              accessibilityLabel="일정 시작 시간"
              editable={!saving && deletingId === null}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setStartTime}
              placeholder="09:00"
              placeholderTextColor={Colors.textGray}
              style={styles.timeInput}
              value={startTime}
            />
            <Text style={styles.rangeSeparator}>~</Text>
            <TextInput
              accessibilityLabel="일정 종료 시간"
              editable={!saving && deletingId === null}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setEndTime}
              placeholder="10:30"
              placeholderTextColor={Colors.textGray}
              style={styles.timeInput}
              value={endTime}
            />
            <TouchableOpacity
              accessibilityLabel="고정 일정 저장"
              accessibilityRole="button"
              activeOpacity={0.8}
              disabled={!validInput || saving || deletingId !== null}
              onPress={() => saveSchedule().catch(() => undefined)}
              style={styles.saveButton}
            >
              {saving ? (
                <ActivityIndicator color={Colors.textWhite} size="small" />
              ) : (
                <Text style={styles.saveText}>
                  {editingId === null ? '등록' : '수정'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {editingId !== null && (
            <TouchableOpacity
              accessibilityLabel="일정 수정 취소"
              accessibilityRole="button"
              disabled={saving || deletingId !== null}
              onPress={resetForm}
              style={styles.cancelEdit}
            >
              <Text style={styles.cancelEditText}>수정 취소</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.sectionTitle, styles.listTitle]}>등록된 일정</Text>
          {loading ? (
            <ActivityIndicator color={Colors.secondary} style={styles.state} />
          ) : error ? (
            <Text accessibilityLiveRegion="polite" style={styles.stateText}>{error}</Text>
          ) : schedules.length === 0 ? (
            <Text style={styles.stateText}>등록된 고정 일정이 없습니다.</Text>
          ) : (
            schedules.map(schedule => (
              <View key={schedule.id} style={styles.scheduleRow}>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                  <Text style={styles.scheduleTime}>
                    {DAYS.find(day => day.value === schedule.dayOfWeek)?.label}요일{' '}
                    {shortTime(schedule.startTime)}~{shortTime(schedule.endTime)}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityLabel={`${schedule.title} 수정`}
                  accessibilityRole="button"
                  disabled={saving || deletingId !== null}
                  onPress={() => editSchedule(schedule)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel={`${schedule.title} 삭제`}
                  accessibilityRole="button"
                  disabled={saving || deletingId !== null}
                  onPress={() => confirmDelete(schedule)}
                  style={styles.secondaryButton}
                >
                  {deletingId === schedule.id ? (
                    <ActivityIndicator color={Colors.secondary} size="small" />
                  ) : (
                    <Text style={styles.secondaryButtonText}>삭제</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, position: 'relative', backgroundColor: Colors.background },
  backButton: { position: 'absolute', width: 24, height: 24 },
  backIcon: { width: '100%', height: '100%' },
  screenTitle: { position: 'absolute', alignSelf: 'center', color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 16, lineHeight: 19 },
  scroll: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  content: { paddingHorizontal: 28, paddingBottom: 32 },
  sectionTitle: { color: Colors.textBlack, fontFamily: 'PretendardBold', fontSize: 17, lineHeight: 22 },
  titleInput: { height: 44, marginTop: 14, paddingHorizontal: 14, paddingVertical: 0, borderRadius: 8, backgroundColor: Colors.gray, color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 15 },
  dayOptions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  dayOption: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: Colors.gray },
  dayOptionSelected: { backgroundColor: Colors.secondary },
  dayOptionText: { color: Colors.textGray, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  dayOptionTextSelected: { color: Colors.textWhite },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  timeInput: { width: 82, height: 44, paddingHorizontal: 12, paddingVertical: 0, borderRadius: 8, backgroundColor: Colors.gray, color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 15 },
  rangeSeparator: { marginHorizontal: 8, color: Colors.textGray, fontSize: 18 },
  saveButton: { width: 70, height: 44, marginLeft: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: Colors.secondary },
  saveText: { color: Colors.textWhite, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  cancelEdit: { alignSelf: 'flex-end', marginTop: 10 },
  cancelEditText: { color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 12 },
  listTitle: { marginTop: 32 },
  state: { marginTop: 30 },
  stateText: { marginTop: 28, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 14, textAlign: 'center' },
  scheduleRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.gray },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  scheduleTime: { marginTop: 4, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 12 },
  secondaryButton: { width: 48, height: 34, marginLeft: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.secondary, borderRadius: 8 },
  secondaryButtonText: { color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12 },
});
