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
import type { DayOfWeek, WakeTarget } from '../api/types';
import { Colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const TIME_PATTERN = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;

type Props = NativeStackScreenProps<RootStackParamList, 'WakeTargets'>;

const loadErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '기상 목표를 불러오지 못했어요.';
  }
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '기상 목표를 불러오지 못했어요.';
  }
};

const saveErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '기상 목표를 저장하지 못했어요.';
  }
  switch (error.code) {
    case 'INVALID_WAKE_TARGET_FORMAT':
    case 'VALIDATION_ERROR':
      return '요일과 시간을 다시 확인해주세요. 예: 월요일, 07:30';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '기상 목표를 저장하지 못했어요.';
  }
};

const deleteErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '기상 목표를 삭제하지 못했어요.';
  }
  switch (error.code) {
    case 'WAKE_TARGET_NOT_FOUND':
      return '이미 삭제되었거나 설정되지 않은 목표예요.';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '기상 목표를 삭제하지 못했어요.';
  }
};

export const WakeTargetScreen = ({ navigation }: Props) => {
  const [targets, setTargets] = useState<WakeTarget[]>([]);
  const [drafts, setDrafts] = useState<Partial<Record<DayOfWeek, string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingDay, setSavingDay] = useState<DayOfWeek | null>(null);
  const [deletingDay, setDeletingDay] = useState<DayOfWeek | null>(null);
  const mutationInFlightRef = useRef(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  const loadTargets = useCallback(async () => {
    const accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) {
      setTargets([]);
      setError('데모 사용자를 선택해주세요.');
      return;
    }

    const response = await nunnunApi.wakeTarget.list();
    setTargets(response.targets);
    setDrafts(
      Object.fromEntries(
        response.targets.map(target => [
          target.day_of_week,
          target.target_wake_time ?? '',
        ]),
      ) as Partial<Record<DayOfWeek, string>>,
    );
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadTargets()
        .catch(loadError => {
          if (active) {
            setError(loadErrorMessage(loadError));
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
      return () => {
        active = false;
      };
    }, [loadTargets]),
  );

  const saveTarget = async (target: WakeTarget) => {
    const time = (drafts[target.day_of_week] ?? '').trim();
    if (!TIME_PATTERN.test(time) || mutationInFlightRef.current) {
      return;
    }

    mutationInFlightRef.current = true;
    setSavingDay(target.day_of_week);
    try {
      await nunnunApi.wakeTarget.upsert(`${target.display_day}, ${time}`);
      await loadTargets();
    } catch (saveError) {
      Alert.alert('저장 실패', saveErrorMessage(saveError));
    } finally {
      mutationInFlightRef.current = false;
      setSavingDay(null);
    }
  };

  const deleteTarget = async (dayOfWeek: DayOfWeek) => {
    if (mutationInFlightRef.current) {
      return;
    }

    mutationInFlightRef.current = true;
    setDeletingDay(dayOfWeek);
    try {
      await nunnunApi.wakeTarget.remove(dayOfWeek);
      await loadTargets();
    } catch (deleteError) {
      Alert.alert('삭제 실패', deleteErrorMessage(deleteError));
    } finally {
      mutationInFlightRef.current = false;
      setDeletingDay(null);
    }
  };

  const confirmDelete = (target: WakeTarget) => {
    Alert.alert(
      '기상 목표 삭제',
      `${target.display_day} 목표를 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteTarget(target.day_of_week).catch(() => undefined),
        },
      ],
    );
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
        <Text style={[styles.title, { top: 22 * scale }]}>기상 목표</Text>
        <Text style={[styles.description, { top: 64 * scale }]}>요일별로 반복할 기상 시간을 설정하세요</Text>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={Colors.secondary} />
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <Text accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.targetList}
            showsVerticalScrollIndicator={false}
            style={[styles.scroll, { top: 96 * scale }]}
          >
            {targets.map(target => {
              const draft = drafts[target.day_of_week] ?? '';
              const busy = savingDay !== null || deletingDay !== null;
              return (
                <View key={target.day_of_week} style={styles.targetRow}>
                  <View style={styles.dayColumn}>
                    <Text style={styles.dayText}>{target.display_day}</Text>
                    <Text style={styles.currentText}>
                      {target.target_wake_time
                        ? `현재 ${target.target_wake_time}`
                        : '설정 없음'}
                    </Text>
                  </View>
                  <TextInput
                    accessibilityLabel={`${target.display_day} 기상 시간`}
                    editable={!busy}
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                    onChangeText={value =>
                      setDrafts(current => ({
                        ...current,
                        [target.day_of_week]: value,
                      }))
                    }
                    placeholder="07:30"
                    placeholderTextColor={Colors.textGray}
                    style={styles.timeInput}
                    value={draft}
                  />
                  <TouchableOpacity
                    accessibilityLabel={`${target.display_day} 기상 목표 저장`}
                    accessibilityRole="button"
                    activeOpacity={0.8}
                    disabled={busy || !TIME_PATTERN.test(draft.trim())}
                    onPress={() => saveTarget(target).catch(() => undefined)}
                    style={[styles.actionButton, styles.saveButton]}
                  >
                    {savingDay === target.day_of_week ? (
                      <ActivityIndicator color={Colors.textWhite} size="small" />
                    ) : (
                      <Text style={styles.saveText}>저장</Text>
                    )}
                  </TouchableOpacity>
                  {target.target_wake_time && (
                    <TouchableOpacity
                      accessibilityLabel={`${target.display_day} 기상 목표 삭제`}
                      accessibilityRole="button"
                      activeOpacity={0.8}
                      disabled={busy}
                      onPress={() => confirmDelete(target)}
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      {deletingDay === target.day_of_week ? (
                        <ActivityIndicator color={Colors.secondary} size="small" />
                      ) : (
                        <Text style={styles.deleteText}>삭제</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
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
  description: { position: 'absolute', alignSelf: 'center', color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 13, lineHeight: 17 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 14 },
  scroll: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  targetList: { paddingHorizontal: 28, paddingBottom: 32, rowGap: 12 },
  targetRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.gray },
  dayColumn: { width: 78 },
  dayText: { color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 15 },
  currentText: { marginTop: 4, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 11 },
  timeInput: { width: 72, height: 40, paddingHorizontal: 10, paddingVertical: 0, borderRadius: 8, backgroundColor: Colors.gray, color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14 },
  actionButton: { height: 36, marginLeft: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  saveButton: { width: 56, backgroundColor: Colors.secondary },
  deleteButton: { width: 50, borderWidth: 1, borderColor: Colors.secondary },
  saveText: { color: Colors.textWhite, fontFamily: 'PretendardSemiBold', fontSize: 12 },
  deleteText: { color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12 },
});
