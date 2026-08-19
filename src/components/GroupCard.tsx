import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/Colors';

type GroupCardProps = {
  type: 'normal' | 'add';
  title: string;
  scale: number;
  onPress?: () => void;
  backColor?: string;
};

export const GroupCard = ({
  type,
  title,
  scale,
  onPress,
  backColor,
}: GroupCardProps) => {
  const isAddGroup = type === 'add';
  const folderImage = isAddGroup
    ? require('../assets/images/add-folder.png')
    : require('../assets/images/group-folder.png');

  return (
    <TouchableOpacity
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={title}
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      style={{ width: 154 * scale, height: 166 * scale }}
    >
      <View
        style={[
          styles.folderBack,
          {
            top: -23 * scale,
            left: (isAddGroup ? 13.66 : 16.85) * scale,
            width: 110 * scale,
            height: 124.856 * scale,
            borderRadius: 14 * scale,
            backgroundColor:
              backColor ?? (isAddGroup ? '#070707' : colors.yellow),
          },
        ]}
      />
      <Image
        source={folderImage}
        resizeMode="contain"
        style={{ width: 154 * scale, height: 139 * scale }}
      />
      {isAddGroup && (
        <View
          pointerEvents="none"
          style={[
            styles.plusIcon,
            {
              left: 53 * scale,
              top: 57 * scale,
              width: 48 * scale,
              height: 48 * scale,
            },
          ]}
        >
          <View
            style={[
              styles.plusVertical,
              {
                width: 4 * scale,
                height: 32 * scale,
                borderRadius: 2 * scale,
              },
            ]}
          />
          <View
            style={[
              styles.plusHorizontal,
              {
                width: 32 * scale,
                height: 4 * scale,
                borderRadius: 2 * scale,
              },
            ]}
          />
        </View>
      )}
      <Text style={[styles.title, { top: 147 * scale }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  folderBack: {
    position: 'absolute',
    transform: [{ rotate: '-4.09deg' }],
  },
  plusIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusVertical: {
    position: 'absolute',
    backgroundColor: colors.grayBorder,
  },
  plusHorizontal: {
    position: 'absolute',
    backgroundColor: colors.grayBorder,
  },
  title: {
    position: 'absolute',
    width: '100%',
    color: colors.black,
    fontFamily: 'PretendardSemiBold',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
});
