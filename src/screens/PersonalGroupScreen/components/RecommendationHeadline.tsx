import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const RecommendationHeadline = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        눈눈님, 오늘은{'\n'}23:30 전후로 잠들어 보세요
      </Text>
      <Text style={styles.subtitle}>
        고정 시간표 및 수면 패턴을 바탕으로 AI가 추천했어요
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.grayText,
    marginTop: 8,
  },
});

export default RecommendationHeadline;
