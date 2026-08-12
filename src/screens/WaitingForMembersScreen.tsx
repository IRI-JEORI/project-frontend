import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import WaitingGlow from '../assets/images/waiting-glow.svg';
import WaitingFace from '../assets/images/waiting-face.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingForMembers'>;

export const WaitingForMembersScreen = (_props: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <WaitingGlow
          width={290 * scale}
          height={290 * scale}
          style={[styles.waitingGlow, { left: 54.5 * scale, top: 227 * scale }]}
        />
        <WaitingFace
          width={144 * scale}
          height={144 * scale}
          style={[styles.waitingFace, { left: 126 * scale, top: 300 * scale }]}
        />
        <Text style={[styles.title, { top: 549 * scale }]}>
          참여를 기다리고 있어요
        </Text>
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
    backgroundColor: Colors.background,
  },
  waitingGlow: {
    position: 'absolute',
  },
  waitingFace: {
    position: 'absolute',
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
});
