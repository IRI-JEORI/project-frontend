import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';

export interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

const DOT_SIZE = 4.4;
const DOT_GAP = 4.4;

const PaginationDots = ({ count, activeIndex }: PaginationDotsProps) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotActive: {
    backgroundColor: colors.black,
  },
  dotInactive: {
    backgroundColor: colors.black,
    opacity: 0.3,
  },
});

export default PaginationDots;
