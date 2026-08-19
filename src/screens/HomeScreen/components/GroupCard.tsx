import React, { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { folderTabSvg } from '../../../assets/icons/folderTab';
import { colors } from '../../../theme/tokens';

export interface GroupCardProps {
  label: string;
  accentColor: string;
  showPlus?: boolean;
  onPress?: () => void;
}

export type GroupCardRef = React.ElementRef<typeof TouchableOpacity>;

const ACCENT_WIDTH = 110;
const ACCENT_HEIGHT = 124.856;
const ACCENT_ROTATION = '-4.093deg';
const ACCENT_LEFT = 17.316;
const ACCENT_TOP = 0;

const ICON_WIDTH = 154;
const ICON_HEIGHT = 139;
const ICON_TOP = 23.233;

const ARTWORK_WIDTH = ICON_WIDTH;
const ARTWORK_HEIGHT = ICON_TOP + ICON_HEIGHT;

const GroupCard = forwardRef<GroupCardRef, GroupCardProps>(({
  label,
  accentColor,
  showPlus,
  onPress,
}, ref) => {
  return (
    <TouchableOpacity ref={ref} style={styles.container} onPress={onPress}>
      <View style={styles.artwork}>
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <SvgXml
          xml={folderTabSvg}
          width={ICON_WIDTH}
          height={ICON_HEIGHT}
          color={colors.folderGray}
          style={styles.card}
        />
        {showPlus && <Text style={styles.plus}>+</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
});

GroupCard.displayName = 'GroupCard';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  artwork: {
    width: ARTWORK_WIDTH,
    height: ARTWORK_HEIGHT,
  },
  accent: {
    position: 'absolute',
    top: ACCENT_TOP,
    left: ACCENT_LEFT,
    width: ACCENT_WIDTH,
    height: ACCENT_HEIGHT,
    borderRadius: 14,
    transform: [{ rotate: ACCENT_ROTATION }],
  },
  card: {
    position: 'absolute',
    top: ICON_TOP,
    left: 0,
  },
  plus: {
    position: 'absolute',
    top: ICON_TOP + ICON_HEIGHT / 2 - 16,
    left: ICON_WIDTH / 2 - 10,
    fontSize: 28,
    color: colors.grayMedium,
    fontFamily: 'PretendardMedium',
  },
  label: {
    fontSize: 13,
    fontFamily: 'PretendardMedium',
    color: colors.brownDarkest,
  },
});

export default GroupCard;
