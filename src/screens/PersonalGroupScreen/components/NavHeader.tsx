import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import { chevronLeftSvg, plusCircleSvg } from '../../../assets/icons/navIcons';
import { colors } from '../../../theme/tokens';

export interface NavHeaderProps {
  title: string;
  showAddButton?: boolean;
  onPressAdd?: () => void;
}

const NavHeader = ({ title, showAddButton, onPressAdd }: NavHeaderProps) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.side}>
        <Icon xml={chevronLeftSvg} size={24} color={colors.black} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {showAddButton ? (
        <TouchableOpacity style={styles.side} onPress={onPressAdd}>
          <Icon xml={plusCircleSvg} size={24} color={colors.black} />
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
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
});

export default NavHeader;
