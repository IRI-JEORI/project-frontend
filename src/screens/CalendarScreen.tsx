import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants/Colors';

export const CalendarScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>일정 연동</Text>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.background,
            textSectionTitleColor: Colors.textBlack,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: Colors.textBlack,
            todayTextColor: Colors.primary,
            dayTextColor: Colors.textBlack,
            textDisabledColor: Colors.textGray,
            dotColor: Colors.primary,
            selectedDotColor: Colors.textBlack,
            arrowColor: Colors.textBlack,
            monthTextColor: Colors.textBlack,
            indicatorColor: Colors.primary,
          }}
          markedDates={{
            '2026-08-12': {marked: true, dotColor: Colors.primary},
            '2026-08-14': {marked: true, dotColor: Colors.secondary},
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 20,
  },
  calendar: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
  },
});
