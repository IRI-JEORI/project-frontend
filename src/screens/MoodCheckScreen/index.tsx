import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';
import MoodSelector from './components/MoodSelector';

const TOP_SPACING = 145;
const HORIZONTAL_MARGIN = 34;
const SELECTOR_TOP_SPACING = 38;

const MoodCheckScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>눈눈님, 잘 주무셨나요?</Text>
      <Text style={styles.subtitle}>가장 일치하는 기분을 골라주세요</Text>
      <View style={styles.selectorWrapper}>
        <MoodSelector />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: TOP_SPACING,
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.brownLight,
    marginTop: 8,
  },
  selectorWrapper: {
    marginTop: SELECTOR_TOP_SPACING,
  },
});

export default MoodCheckScreen;
