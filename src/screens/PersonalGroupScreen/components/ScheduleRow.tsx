import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../constants/Colors';

export interface ScheduleRowProps {
  label: string;
}

const ScheduleRow = ({ label }: ScheduleRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 40,
    marginHorizontal: 21,
    borderRadius: 8,
    backgroundColor: colors.bannerBg,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
});

export default ScheduleRow;
