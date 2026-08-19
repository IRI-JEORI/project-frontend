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
import type { DayOfWeek, DndWindow } from '../api/types';
import { Colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const TIME_PATTERN = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
const DAYS: Array<{ value: DayOfWeek; label: string }> = [
  { value: 'MONDAY', label: '월요일' },
  { value: 'TUESDAY', label: '화요일' },
  { value: 'WEDNESDAY', label: '수요일' },
  { value: 'THURSDAY', label: '목요일' },
  { value: 'FRIDAY', label: '금요일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'DndWindows'>;

const dndLoadErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '방해금지 시간을 불러오지 못했어요.';
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '방해금지 시간을 불러오지 못했어요.';
  }
};

const dndCreateErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '방해금지 시간을 등록하지 못했어요.';
  switch (error.code) {
    case 'INVALID_DND_FORMAT':
      return '요일과 시간을 다시 확인해주세요. 예: 월요일, 08:00~11:00';
    case 'INVALID_TIME_RANGE':
      return '시작 시간은 종료 시간보다 빨라야 해요.';
    case 'DUPLICATE_RESOURCE':
      return '동일한 방해금지 시간이 이미 등록되어 있어요.';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '방해금지 시간을 등록하지 못했어요.';
  }
};

const dndDeleteErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '방해금지 시간을 삭제하지 못했어요.';
  switch (error.code) {
    case 'RESOURCE_NOT_FOUND':
      return '이미 삭제되었거나 내 설정이 아닌 항목이에요.';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '방해금지 시간을 삭제하지 못했어요.';
  }
};

export const DndWindowScreen = ({ navigation }: Props) => {
  const [windows, setWindows] = useState<DndWindow[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MONDAY');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const mutationInFlightRef = useRef(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  const loadWindows = useCallback(async () => {
    const accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) {
      setWindows([]);
      setError('데모 사용자를 선택해주세요.');
      return;
    }
    const response = await nunnunApi.dnd.list();
    setWindows(response.windows);
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadWindows()
        .catch(loadError => {
          if (active) setError(dndLoadErrorMessage(loadError));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [loadWindows]),
  );

  const validRange =
    TIME_PATTERN.test(startTime.trim()) &&
    TIME_PATTERN.test(endTime.trim()) &&
    startTime.trim() < endTime.trim();

  const createWindow = async () => {
    if (!validRange || mutationInFlightRef.current) return;
    const day = DAYS.find(candidate => candidate.value === selectedDay)!;
    mutationInFlightRef.current = true;
    setCreating(true);
    try {
      await nunnunApi.dnd.create(
        `${day.label}, ${startTime.trim()}~${endTime.trim()}`,
      );
      await loadWindows();
      setStartTime('');
      setEndTime('');
    } catch (createError) {
      Alert.alert('등록 실패', dndCreateErrorMessage(createError));
    } finally {
      mutationInFlightRef.current = false;
      setCreating(false);
    }
  };

  const deleteWindow = async (id: number) => {
    if (mutationInFlightRef.current) return;
    mutationInFlightRef.current = true;
    setDeletingId(id);
    try {
      await nunnunApi.dnd.remove(id);
      await loadWindows();
    } catch (deleteError) {
      Alert.alert('삭제 실패', dndDeleteErrorMessage(deleteError));
    } finally {
      mutationInFlightRef.current = false;
      setDeletingId(null);
    }
  };

  const confirmDelete = (window: DndWindow) => {
    Alert.alert('방해금지 시간 삭제', `${window.display_text}을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteWindow(window.id).catch(() => undefined),
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
        <Text style={[styles.title, { top: 22 * scale }]}>방해금지 시간</Text>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={[styles.scroll, { top: 62 * scale }]}
        >
          <Text style={styles.sectionTitle}>새 방해금지 시간</Text>
          <View style={styles.dayOptions}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedDay === day.value }}
                activeOpacity={0.8}
                disabled={creating || deletingId !== null}
                onPress={() => setSelectedDay(day.value)}
                style={[
                  styles.dayOption,
                  selectedDay === day.value && styles.dayOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayOptionText,
                    selectedDay === day.value && styles.dayOptionTextSelected,
                  ]}
                >
                  {day.label.slice(0, 1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.timeRow}>
            <TextInput
              accessibilityLabel="방해금지 시작 시간"
              editable={!creating && deletingId === null}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setStartTime}
              placeholder="08:00"
              placeholderTextColor={Colors.textGray}
              style={styles.timeInput}
              value={startTime}
            />
            <Text style={styles.rangeSeparator}>~</Text>
            <TextInput
              accessibilityLabel="방해금지 종료 시간"
              editable={!creating && deletingId === null}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={setEndTime}
              placeholder="11:00"
              placeholderTextColor={Colors.textGray}
              style={styles.timeInput}
              value={endTime}
            />
            <TouchableOpacity
              accessibilityLabel="방해금지 시간 등록"
              accessibilityRole="button"
              activeOpacity={0.8}
              disabled={!validRange || creating || deletingId !== null}
              onPress={() => createWindow().catch(() => undefined)}
              style={styles.createButton}
            >
              {creating ? (
                <ActivityIndicator color={Colors.textWhite} size="small" />
              ) : (
                <Text style={styles.createButtonText}>등록</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>같은 요일에 여러 구간을 등록할 수 있어요</Text>

          <Text style={[styles.sectionTitle, styles.listTitle]}>등록된 시간</Text>
          {loading ? (
            <ActivityIndicator color={Colors.secondary} style={styles.state} />
          ) : error ? (
            <Text accessibilityLiveRegion="polite" style={styles.stateText}>{error}</Text>
          ) : windows.length === 0 ? (
            <Text style={styles.stateText}>설정된 방해금지 시간이 없습니다.</Text>
          ) : (
            windows.map(window => (
              <View key={window.id} style={styles.windowRow}>
                <Text style={styles.windowText}>{window.display_text}</Text>
                <TouchableOpacity
                  accessibilityLabel={`${window.display_text} 삭제`}
                  accessibilityRole="button"
                  activeOpacity={0.8}
                  disabled={creating || deletingId !== null}
                  onPress={() => confirmDelete(window)}
                  style={styles.deleteButton}
                >
                  {deletingId === window.id ? (
                    <ActivityIndicator color={Colors.secondary} size="small" />
                  ) : (
                    <Text style={styles.deleteText}>삭제</Text>
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
  title: { position: 'absolute', alignSelf: 'center', color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 16, lineHeight: 19 },
  scroll: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  content: { paddingHorizontal: 28, paddingBottom: 32 },
  sectionTitle: { color: Colors.textBlack, fontFamily: 'PretendardBold', fontSize: 17, lineHeight: 22 },
  dayOptions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  dayOption: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: Colors.gray },
  dayOptionSelected: { backgroundColor: Colors.secondary },
  dayOptionText: { color: Colors.textGray, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  dayOptionTextSelected: { color: Colors.textWhite },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  timeInput: { width: 82, height: 44, paddingHorizontal: 12, paddingVertical: 0, borderRadius: 8, backgroundColor: Colors.gray, color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 15 },
  rangeSeparator: { marginHorizontal: 8, color: Colors.textGray, fontSize: 18 },
  createButton: { width: 70, height: 44, marginLeft: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: Colors.secondary },
  createButtonText: { color: Colors.textWhite, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  helperText: { marginTop: 9, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 12 },
  listTitle: { marginTop: 36 },
  state: { marginTop: 30 },
  stateText: { marginTop: 28, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 14, textAlign: 'center' },
  windowRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.gray },
  windowText: { color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  deleteButton: { width: 52, height: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.secondary, borderRadius: 8 },
  deleteText: { color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12 },
});
