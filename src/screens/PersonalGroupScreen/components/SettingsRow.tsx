import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/tokens';

export interface SettingsRowProps {
  label: string;
  onPress?: () => void;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

const SettingsRow = ({
  label,
  onPress,
  toggleValue,
  onToggleChange,
}: SettingsRowProps) => {
  const isToggle = toggleValue !== undefined;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={isToggle ? 1 : 0.7}
      disabled={isToggle}
    >
      <Text style={styles.label}>{label}</Text>
      {isToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ true: colors.brown, false: colors.folderGray }}
          thumbColor={colors.white}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 40,
    marginHorizontal: 21,
    borderRadius: 8,
    backgroundColor: colors.bannerBg,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
});

export default SettingsRow;
