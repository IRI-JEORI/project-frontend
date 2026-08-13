import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const DOT_COUNT = 3;

const PromoBanner = () => {
  return (
    <View style={styles.card}>
      <View style={styles.dots}>
        {Array.from({ length: DOT_COUNT }).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === 0 && styles.dotActive]}
          />
        ))}
      </View>
      <Text style={styles.title}>NUNNUN을 잘 활용하려면?</Text>
      <Text style={styles.subtitle}>
        시간표를 추가하면 수면 시간을 추천받을 수 있어요
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dots: {
    position: 'absolute',
    top: 14,
    right: 16,
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 4.4,
    height: 4.4,
    borderRadius: 2.2,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.black,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.grayBorder,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginTop: 4,
  },
});

export default PromoBanner;
