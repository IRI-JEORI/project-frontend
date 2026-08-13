import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const HOURS = ['00', '03', '06', '09', '12', '15', '18', '21'];

const ScheduleGrid = () => {
  return (
    <View style={styles.grid}>
      <View style={styles.dayRow}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.hourColumn}>
        {HOURS.map((hour) => (
          <Text key={hour} style={styles.hourLabel}>
            {hour}
          </Text>
        ))}
      </View>
    </View>
  );
};

const GRID_WIDTH = 346;
const GRID_HEIGHT = 350;

const styles = StyleSheet.create({
  grid: {
    alignSelf: 'center',
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    backgroundColor: colors.scheduleGridGray,
    borderRadius: 8,
    paddingTop: 15,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 16,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  hourColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingVertical: 24,
    paddingBottom: 30,
  },
  hourLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.black,
  },
});

export default ScheduleGrid;
