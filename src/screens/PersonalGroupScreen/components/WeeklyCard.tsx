import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const DAYS = [
  { label: '월', date: 3 },
  { label: '화', date: 4 },
  { label: '수', date: 5 },
  { label: '목', date: 6, today: true },
  { label: '금', date: 7 },
  { label: '토', date: 8 },
  { label: '일', date: 9 },
];

export interface WeeklyCardProps {
  onPressChangeTime?: () => void;
}

const WeeklyCard = ({ onPressChangeTime }: WeeklyCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>이번 주 기상 · 귀가</Text>
      <View style={styles.dayRow}>
        {DAYS.map((day) => (
          <View key={day.label} style={styles.dayColumn}>
            <Text style={[styles.dayLabel, day.today && styles.todayLabel]}>
              {day.label}
            </Text>
            <Text style={[styles.dayDate, day.today && styles.todayDate]}>
              {day.date}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.todayRow}>
        <View style={styles.todayBadge}>
          <Text style={styles.todayBadgeLabel}>목</Text>
          <Text style={styles.todayBadgeDate}>6</Text>
        </View>
        <View>
          <Text style={styles.detailText}>기상 7:30</Text>
          <Text style={styles.detailTextMedium}>귀가 23:00</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPressChangeTime}>
        <Text style={styles.buttonLabel}>오늘 귀가 시간이 바뀌었어요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 13,
    color: colors.black,
  },
  todayLabel: {
    fontWeight: '700',
  },
  dayDate: {
    fontSize: 13,
    color: colors.black,
  },
  todayDate: {
    fontWeight: '700',
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  todayBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.black,
  },
  todayBadgeDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  detailTextMedium: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});

export default WeeklyCard;
