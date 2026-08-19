import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

export interface BottomLinksProps {
  onRegisterPress?: () => void;
}

const BottomLinks = ({ onRegisterPress }: BottomLinksProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orText}>또는</Text>
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={onRegisterPress}>
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
    gap: 12,
  },
  orText: {
    fontSize: 14,
    fontFamily: 'PretendardSemiBold',
    color: colors.black,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 14,
    fontFamily: 'PretendardSemiBold',
    color: colors.grayBorder,
  },
  divider: {
    fontSize: 13,
    fontFamily: 'PretendardMedium',
    color: colors.grayBorder,
  },
});

export default BottomLinks;
