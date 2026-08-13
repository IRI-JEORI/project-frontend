import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import { chevronLeftSvg } from '../../../assets/icons/navIcons';
import { colors } from '../../../theme/tokens';

const NavHeader = () => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.back}>
        <Icon xml={chevronLeftSvg} size={24} color={colors.black} />
      </TouchableOpacity>
      <Text style={styles.title}>오늘</Text>
      <View style={styles.back} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  back: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
});

export default NavHeader;
