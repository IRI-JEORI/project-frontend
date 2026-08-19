import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import {
  chevronLeftSvg,
  menuIconSvg,
  plusCircleSvg,
} from '../../assets/icons/navIcons';
import { colors } from '../../theme/tokens';

export interface NavHeaderProps {
  title: string;
  rightIcon?: 'add' | 'menu';
  onPressRight?: () => void;
  onPressBack?: () => void;
}

const RIGHT_ICONS = {
  add: plusCircleSvg,
  menu: menuIconSvg,
};

const NavHeader = ({
  title,
  rightIcon,
  onPressRight,
  onPressBack,
}: NavHeaderProps) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.side} onPress={onPressBack}>
        <Icon xml={chevronLeftSvg} size={24} color={colors.black} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity style={styles.side} onPress={onPressRight}>
          <Icon
            xml={RIGHT_ICONS[rightIcon]}
            size={rightIcon === 'menu' ? 20 : 24}
            color={colors.black}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}
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
  side: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PretendardMedium',
    color: colors.black,
  },
});

export default NavHeader;
