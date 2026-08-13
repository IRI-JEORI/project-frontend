import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const MOOD_COLORS = [
  colors.gray,
  colors.grayMedium,
  colors.brown,
  colors.yellowLight,
  colors.yellow,
];

const CIRCLE_SIZE = 50;
const CIRCLE_GAP = 18;

const MoodSelector = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <View style={styles.row}>
      {MOOD_COLORS.map((color, index) => {
        const isFirst = index === 0;
        const isLast = index === MOOD_COLORS.length - 1;

        return (
          <View key={color} style={styles.column}>
            <TouchableOpacity
              onPress={() => setSelectedIndex(index)}
              style={[
                styles.circle,
                { backgroundColor: color },
                selectedIndex === index && styles.circleSelected,
              ]}
            />
            {isFirst && (
              <TouchableOpacity style={styles.adjustButton}>
                <Text style={styles.adjustLabel}>−</Text>
              </TouchableOpacity>
            )}
            {isLast && (
              <TouchableOpacity style={styles.adjustButton}>
                <Text style={styles.adjustLabel}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: CIRCLE_GAP,
    marginHorizontal: 6,
  },
  column: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  circleSelected: {
    borderWidth: 2,
    borderColor: colors.brownDarkest,
  },
  adjustButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustLabel: {
    fontSize: 18,
    color: colors.brownLight,
    lineHeight: 20,
  },
});

export default MoodSelector;
