import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { ApiError, nunnunApi, tokenStorage } from '../api';
import type { MyStatsResponse } from '../api/types';
import { Colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

const statsErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) return '기상 통계를 불러오지 못했어요.';
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '기상 통계를 불러오지 못했어요.';
  }
};

const gapLabel = (minutes: number) => {
  if (minutes === 0) return '목표 시각 기준 0분';
  return minutes < 0
    ? `목표보다 ${Math.abs(minutes).toFixed(1)}분 일찍`
    : `목표보다 ${minutes.toFixed(1)}분 늦게`;
};

export const StatsScreen = ({ navigation }: Props) => {
  const [stats, setStats] = useState<MyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  const loadStats = useCallback(async () => {
    const accessToken = await tokenStorage.getAccessToken();
    if (!accessToken) {
      setStats(null);
      setError('데모 사용자를 선택해주세요.');
      return;
    }
    setStats(await nunnunApi.me.getStats());
    setError(null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      loadStats()
        .catch(loadError => {
          if (active) setError(statsErrorMessage(loadError));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [loadStats]),
  );

  const retry = () => {
    setLoading(true);
    loadStats()
      .catch(loadError => setError(statsErrorMessage(loadError)))
      .finally(() => setLoading(false));
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
        <Text style={[styles.title, { top: 22 * scale }]}>기상 통계</Text>
        <Text style={[styles.description, { top: 66 * scale }]}>보존된 전체 기상 인증 기록 기준</Text>

        <View style={[styles.content, { top: 112 * scale, left: 28 * scale, width: 346 * scale }]}>
          {loading ? (
            <ActivityIndicator color={Colors.secondary} style={styles.state} />
          ) : error ? (
            <View style={styles.state}>
              <Text accessibilityLiveRegion="polite" style={styles.errorText}>{error}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={retry}>
                <Text style={styles.retryText}>다시 시도</Text>
              </TouchableOpacity>
            </View>
          ) : stats ? (
            <>
              <View style={styles.primaryCard}>
                <Text style={styles.cardLabel}>기상 인증 성공률</Text>
                <Text style={styles.primaryValue}>{stats.success_rate.toFixed(1)}%</Text>
                <Text style={styles.cardDescription}>완료된 VERIFIED와 NEEDS_HELP 요청 기준</Text>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.smallCard}>
                  <Text style={styles.cardLabel}>평균 목표 차이</Text>
                  <Text style={styles.smallValue}>{stats.avg_gap_minutes.toFixed(1)}분</Text>
                  <Text style={styles.smallDescription}>{gapLabel(stats.avg_gap_minutes)}</Text>
                </View>
                <View style={styles.smallCard}>
                  <Text style={styles.cardLabel}>연속 성공</Text>
                  <Text style={styles.smallValue}>{stats.streak_days}일</Text>
                  <Text style={styles.smallDescription}>연속된 성공 인증 날짜</Text>
                </View>
              </View>
              <Text style={styles.notice}>기간 선택 없이 현재 DB에 보존된 전체 기록을 사용해요.</Text>
            </>
          ) : null}
        </View>
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
  description: { position: 'absolute', alignSelf: 'center', color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 13 },
  content: { position: 'absolute' },
  state: { minHeight: 180, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 14 },
  retryText: { marginTop: 10, color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 13 },
  primaryCard: { minHeight: 154, padding: 22, borderRadius: 20, backgroundColor: Colors.gray },
  cardLabel: { color: Colors.textGray, fontFamily: 'PretendardSemiBold', fontSize: 13 },
  primaryValue: { marginTop: 12, color: Colors.textBlack, fontFamily: 'PretendardBold', fontSize: 36, lineHeight: 43 },
  cardDescription: { marginTop: 10, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 11 },
  cardRow: { flexDirection: 'row', columnGap: 14, marginTop: 14 },
  smallCard: { flex: 1, minHeight: 145, padding: 18, borderRadius: 20, backgroundColor: Colors.gray },
  smallValue: { marginTop: 14, color: Colors.textBlack, fontFamily: 'PretendardBold', fontSize: 23, lineHeight: 28 },
  smallDescription: { marginTop: 10, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 10, lineHeight: 15 },
  notice: { marginTop: 18, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 11, textAlign: 'center' },
});
