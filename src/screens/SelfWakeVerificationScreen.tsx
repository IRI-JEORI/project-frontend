import React, { useEffect, useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import WakeTimerTrack from '../assets/images/wake-timer-track.svg';
import WakeTimerProgress from '../assets/images/wake-timer-progress.svg';
import { ApiError, nunnunApi, type SelfVerifyCreated } from '../api';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'SelfWakeVerification'>;

const selfVerifyErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '셀프 인증을 시작하지 못했어요.';
  }

  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'WAKE_GROUP_NOT_FOUND':
      return '가입한 깨우기 그룹을 찾을 수 없어요.';
    case 'ACTIVE_POSE_NOT_FOUND':
      return '오늘의 인증 포즈가 준비되지 않았어요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '셀프 인증을 시작하지 못했어요.';
  }
};

export const SelfWakeVerificationScreen = ({ navigation, route }: Props) => {
  const isBackendFlow = route.params.groupId !== undefined;
  const [selfVerify, setSelfVerify] = useState<SelfVerifyCreated | null>(null);
  const [loading, setLoading] = useState(isBackendFlow);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(() => {
    if (!isBackendFlow) {
      return;
    }

    let active = true;
    nunnunApi.wake
      .startSelfVerify()
      .then(result => {
        if (active) {
          setSelfVerify(result);
        }
      })
      .catch(error => {
        if (active) {
          setErrorMessage(selfVerifyErrorMessage(error));
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
  }, [isBackendFlow]);

  if (loading || errorMessage) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.background}
          barStyle="dark-content"
        />
        <View style={styles.feedbackContainer}>
          {loading ? (
            <ActivityIndicator color={Colors.textBlack} />
          ) : (
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          )}
          {errorMessage && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="그룹으로 돌아가기"
              onPress={() => navigation.goBack()}
              style={styles.feedbackButton}
            >
              <Text style={styles.feedbackButtonText}>돌아가기</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <View
          style={[
            styles.verificationCard,
            {
              left: 34 * scale,
              top: 29 * scale,
              width: 334 * scale,
              height: 340 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        >
          <Text style={[styles.groupName, { top: 42 * scale }]}>
            {route.params.groupName ?? '아침야호'}
          </Text>
          <Text style={[styles.title, { top: 64 * scale }]}>
            내 기상을 인증할게요
          </Text>
          <WakeTimerTrack
            width={268.102 * scale}
            height={135 * scale}
            style={[styles.timerTrack, { left: 33 * scale, top: 134 * scale }]}
          />
          <WakeTimerProgress
            width={107.484 * scale}
            height={127.427 * scale}
            style={[
              styles.timerProgress,
              { left: 193 * scale, top: 141.57 * scale },
            ]}
          />
          <Image
            accessibilityLabel="셀프 기상 인증 타이머"
            resizeMode="contain"
            source={require('../assets/images/wake-bomb.png')}
            style={[
              styles.bombIcon,
              {
                left: 167 * scale,
                top: 111 * scale,
                width: 72 * scale,
                height: 72 * scale,
              },
            ]}
          />
          <Text style={[styles.wakeTime, { top: 221 * scale }]}>07:32</Text>
        </View>

        <Text style={[styles.poseDescription, { top: 400 * scale }]}>
          {selfVerify?.pose.description ??
            '00분 내에 오늘의 포즈를 따라해주세요'}
        </Text>

        <Image
          accessibilityLabel={
            isBackendFlow ? '데모 인증 포즈 이미지' : '오늘의 셀프 인증 포즈'
          }
          resizeMode="cover"
          source={require('../assets/images/wake-pose-reference.png')}
          style={[
            styles.poseImage,
            {
              left: 34 * scale,
              top: 428 * scale,
              width: 334 * scale,
              height: 368 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        />

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="인증사진 찍기"
          activeOpacity={0.8}
          onPress={() =>
            navigation.replace('CameraCapture', {
              recipientName: route.params.recipientName,
              photographer: route.params.photographer,
              requestId: selfVerify?.wake_request_id,
              groupId: route.params.groupId,
              verificationMode: isBackendFlow ? 'self-verify' : undefined,
            })
          }
          style={[
            styles.cameraButton,
            {
              bottom: 18 * scale,
              width: 346 * scale,
              height: 65 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        >
          <Text style={styles.cameraButtonText}>인증사진 찍기</Text>
        </TouchableOpacity>
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
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  feedbackText: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  feedbackButton: {
    minWidth: 120,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.textBlack,
  },
  feedbackButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
  },
  verificationCard: {
    position: 'absolute',
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  groupName: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  timerTrack: { position: 'absolute' },
  timerProgress: { position: 'absolute' },
  bombIcon: { position: 'absolute', zIndex: 1 },
  wakeTime: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 40,
    lineHeight: 48,
  },
  poseDescription: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  poseImage: { position: 'absolute', overflow: 'hidden' },
  cameraButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4B4B',
  },
  cameraButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 23,
  },
});
