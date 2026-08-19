import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/tokens';

export interface AddRowButtonProps {
  label: string;
  onPress?: () => void;
}

const AddRowButton = ({ label, onPress }: AddRowButtonProps) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 40,
    marginHorizontal: 21,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily: 'PretendardSemiBold',
    color: colors.grayBorder,
  },
});

export default AddRowButton;
