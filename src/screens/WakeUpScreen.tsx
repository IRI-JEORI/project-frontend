import React from 'react';
import {
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

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'WakeUp'>;

export const WakeUpScreen = ({ route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.secondary} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <View style={[styles.messageArea, { top: 250 * scale }]}>
          <Text style={styles.time}>07:32</Text>
          <Text style={[styles.wakerText, { marginTop: 8 * scale }]}>
            {route.params.wakerName}님이 깨웠어요
          </Text>
          <Text style={[styles.guideText, { marginTop: 31 * scale }]}>
            일어났다면 인증사진을 찍어주세요{`\n`}사진은 8시간 후 사라져요
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="인증사진 찍기"
          activeOpacity={0.8}
          style={[
            styles.cameraButton,
            {
              bottom: 22 * scale,
              width: 346 * scale,
              height: 60 * scale,
              borderRadius: 8 * scale,
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
    backgroundColor: Colors.secondary,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.secondary,
  },
  messageArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  time: {
    color: Colors.textWhite,
    fontFamily: 'PretendardBold',
    fontSize: 64,
    lineHeight: 77,
  },
  wakerText: {
    color: Colors.gray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  guideText: {
    color: Colors.gray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
  },
  cameraButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  cameraButtonText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
});
