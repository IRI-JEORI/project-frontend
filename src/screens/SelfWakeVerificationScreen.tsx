import React from 'react';
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
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import WakeTimerTrack from '../assets/images/wake-timer-track.svg';
import WakeTimerProgress from '../assets/images/wake-timer-progress.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'SelfWakeVerification'>;

export const SelfWakeVerificationScreen = ({ navigation, route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

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
          <Text style={[styles.groupName, { top: 42 * scale }]}>아침야호</Text>
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
          00분 내에 오늘의 포즈를 따라해주세요
        </Text>

        <Image
          accessibilityLabel="오늘의 셀프 인증 포즈"
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
