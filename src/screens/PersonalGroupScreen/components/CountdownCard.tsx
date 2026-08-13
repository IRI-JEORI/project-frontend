import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const CountdownCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>다음 넛지 알림까지</Text>
      <Text style={styles.time}>7시간 30분 전</Text>
      <Text style={styles.hint}>지금 자면 컨디션을 온전히 회복할 수 있어요</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonLabel}>잠들기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 24,
    marginTop: 38,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.grayBorder,
  },
  time: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.grayBorder,
    marginTop: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.brownDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
});

export default CountdownCard;
