import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  JIWOO_WAKE_EXHAUSTED_STORAGE_KEY,
  JIWOO_WAKE_REQUEST_STORAGE_KEY,
  MINJU_WAKE_REQUEST_STORAGE_KEY,
} from '../constants/DemoUser';
import PoseFailureRingTrack from '../assets/images/pose-failure-ring-track.svg';
import PoseFailureRingProgress from '../assets/images/pose-failure-ring-progress.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoAnalysisFailure'>;

export const PhotoAnalysisFailureScreen = ({ navigation, route }: Props) => {
  const isBackendResult = route.params.proofResult !== undefined;
  const isRetryExhausted = isBackendResult
    ? !route.params.proofResult?.can_retry
    : route.params.attempt >= 2;
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(() => {
    if (!isRetryExhausted) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining(seconds => Math.max(seconds - 1, 0));
    }, 1000);
    const timer = setTimeout(() => {
      if (isBackendResult) {
        if (route.params.groupId !== undefined) {
          navigation.replace('WakeGroupDetail', { groupId: route.params.groupId });
        } else {
          navigation.replace('Home');
        }
        return;
      }

      const wakeRequestStorageKey =
        route.params.photographer === 'minju'
          ? MINJU_WAKE_REQUEST_STORAGE_KEY
          : JIWOO_WAKE_REQUEST_STORAGE_KEY;
      const exhaustionStorageTask =
        route.params.photographer === 'jiwoo'
          ? AsyncStorage.setItem(JIWOO_WAKE_EXHAUSTED_STORAGE_KEY, 'true')
          : Promise.resolve();
      Promise.all([
        AsyncStorage.removeItem(wakeRequestStorageKey),
        exhaustionStorageTask,
      ])
        .catch(() => undefined)
        .finally(() => {
          navigation.replace('WaitingForMembers', {
            groupType: 'wake',
            groupName: '아침야호',
            viewer: route.params.photographer,
          });
        });
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [
    isBackendResult,
    isRetryExhausted,
    navigation,
    route.params.groupId,
    route.params.photographer,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <Text style={[styles.title, { top: 93 * scale }]}>판정 완료!</Text>
        <Text style={[styles.description, { top: 128 * scale }]}>
          AI가 분석했어요
        </Text>

        <View
          style={[
            styles.resultCard,
            {
              left: 34 * scale,
              top: 174 * scale,
              width: 334 * scale,
              height: 384 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        >
          <PoseFailureRingTrack
            width={269.051 * scale}
            height={270.001 * scale}
            style={[styles.ring, { left: 32 * scale, top: 68 * scale }]}
          />
          <PoseFailureRingProgress
            width={52.6494 * scale}
            height={35.8573 * scale}
            style={[styles.ring, { left: 155 * scale, top: 68 * scale }]}
          />
          <Image
            accessibilityLabel="포즈 판정 실패"
            resizeMode="contain"
            source={require('../assets/images/pose-failure-bomb.png')}
            style={[
              styles.bombIcon,
              {
                left: 167 * scale,
                top: 45 * scale,
                width: 72 * scale,
                height: 72 * scale,
              },
            ]}
          />
          <View style={[styles.scoreArea, { top: 168 * scale }]}>
            <Text style={styles.scoreLabel}>포즈 일치율</Text>
            <Text style={styles.score}>
              {route.params.proofResult?.pose_match_score ?? 2}%
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.retrySheet,
            {
              left: 13 * scale,
              top: (isRetryExhausted ? 679 : 504) * scale,
              width: 376 * scale,
              borderTopLeftRadius: 36 * scale,
              borderTopRightRadius: 36 * scale,
            },
          ]}
        >
          <View
            style={[
              styles.sheetGrabber,
              {
                top: 5 * scale,
                width: 36 * scale,
                height: 5 * scale,
                borderRadius: 3 * scale,
              },
            ]}
          />
          <Text
            style={[
              styles.retryTitle,
              { left: 21 * scale, top: (isRetryExhausted ? 47 : 53) * scale },
            ]}
          >
            {isRetryExhausted
              ? '이런! 재시도 기회를 다 썼어요'
              : `포즈가 일치하지 않아요\n다시 도전하시겠어요?`}
          </Text>
          <Text
            style={[
              styles.retryDescription,
              {
                left: 21 * scale,
                top: (isRetryExhausted ? 82 : 118) * scale,
              },
            ]}
          >
            {isRetryExhausted
              ? `${secondsRemaining}초 후 화면이 자동으로 닫혀요`
              : `${route.params.proofResult?.remaining_attempts ?? 1}번 더 남았어요`}
          </Text>
          {!isRetryExhausted && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="사진 다시 찍기"
              activeOpacity={0.8}
              onPress={() =>
                navigation.replace('CameraCapture', {
                  recipientName: route.params.recipientName,
                  photographer: route.params.photographer,
                  attempt:
                    (route.params.proofResult?.attempt_no ??
                      route.params.attempt) + 1,
                  requestId: route.params.requestId,
                  groupId: route.params.groupId,
                  verificationMode: route.params.verificationMode,
                })
              }
              style={[
                styles.retryButton,
                {
                  left: 15 * scale,
                  top: 209 * scale,
                  width: 346 * scale,
                  height: 65 * scale,
                  borderRadius: 16 * scale,
                },
              ]}
            >
              <Text style={styles.retryButtonText}>다시 찍기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  description: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  resultCard: {
    position: 'absolute',
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  ring: {
    position: 'absolute',
  },
  bombIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  scoreArea: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
  scoreLabel: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  score: {
    marginTop: 1,
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 40,
    lineHeight: 48,
  },
  retrySheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  sheetGrabber: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
  },
  retryTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  retryDescription: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  retryButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4B4B',
  },
  retryButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 23,
  },
});
