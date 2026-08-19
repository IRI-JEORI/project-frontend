import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from '../../../components/Icon';
import { colors } from '../../../constants/Colors';

export interface PermissionItemProps {
  iconXml: string;
  title: string;
  required?: boolean;
  description: string;
}

const PermissionItem = ({
  iconXml,
  title,
  required,
  description,
}: PermissionItemProps) => {
  return (
    <View style={styles.row}>
      <Icon xml={iconXml} />
      <View style={styles.textColumn}>
        <Text style={styles.title}>
          {title}
          {required ? ' (필수)' : ''}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  textColumn: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  description: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.grayBorder,
  },
});

export default PermissionItem;
