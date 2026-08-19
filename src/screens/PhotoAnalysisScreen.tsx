import React, { useEffect } from 'react';
import {
  Image,
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
import { getDemoPoseAnalysisResult } from '../utils/analyzePose';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const ANALYSIS_DURATION_MS = 2200;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoAnalysis'>;

export const PhotoAnalysisScreen = ({ navigation, route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = getDemoPoseAnalysisResult();
      if (result === 'success') {
        navigation.replace('PhotoAnalysisSuccess', route.params);
        return;
      }

      navigation.replace('PhotoAnalysisFailure', {
        recipientName: route.params.recipientName,
        photographer: route.params.photographer,
        attempt: route.params.attempt ?? 1,
      });
    }, ANALYSIS_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, route.params]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <Image
          accessibilityLabel="사진 분석 중"
          resizeMode="contain"
          source={require('../assets/images/pose-analysis-caution.png')}
          style={[
            styles.cautionIcon,
            {
              top: 235 * scale,
              width: 104 * scale,
              height: 104 * scale,
            },
          ]}
        />
        <Text style={[styles.title, { top: 354 * scale }]}>
          포즈가 일치하는지 확인하는 중..
        </Text>
        <Text style={[styles.description, { top: 389 * scale }]}>
          AI가 분석하고 있어요
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
  cautionIcon: {
    position: 'absolute',
    alignSelf: 'center',
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
});
