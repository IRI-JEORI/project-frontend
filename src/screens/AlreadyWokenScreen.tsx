import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import AlreadyWokenIcon from '../assets/images/already-woken.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'AlreadyWoken'>;

export const AlreadyWokenScreen = ({ route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <View style={styles.messageArea}>
          <AlreadyWokenIcon width={61.442 * scale} height={61.442 * scale} />
          <Text style={[styles.message, { marginTop: 28 * scale }]}>
            {route.params.wakerName}님이 이미 깨웠어요
          </Text>
        </View>

        <Text style={[styles.guide, { bottom: 56 * scale }]}>
          깨우기 알람은 다른 친구가 깨우기 전에 사용할 수 있어요
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
  messageArea: {
    position: 'absolute',
    top: '43.71%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  message: {
    color: '#757575',
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  guide: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#757575',
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
});
