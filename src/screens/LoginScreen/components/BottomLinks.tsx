import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const BottomLinks = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.orText}>또는</Text>
      <View style={styles.linkRow}>
        <TouchableOpacity>
          <Text style={styles.link}>회원가입</Text>
        </TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity>
          <Text style={styles.link}>아이디 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brownDarkest,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 13,
    color: colors.gray,
  },
  divider: {
    fontSize: 13,
    color: colors.gray,
  },
});

export default BottomLinks;
