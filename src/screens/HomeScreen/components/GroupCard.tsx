import React from 'react';
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

const ACCENT_WIDTH = 110;
const ACCENT_HEIGHT = 124.856;
const ACCENT_ROTATION = '-4.093deg';

const CARD_WIDTH = 130;
const CARD_HEIGHT = 117;
const CARD_TOP = 10;

const ARTWORK_HEIGHT = CARD_TOP + CARD_HEIGHT;

const GroupCard = ({ label, accentColor, showPlus, onPress }: GroupCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.artwork}>
        <View
          style={[
            styles.accent,
            { backgroundColor: accentColor },
          ]}
        />
        <SvgXml
          xml={folderTabSvg}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          color={colors.folderGray}
          style={styles.card}
        />
        {showPlus && (
          <Text style={styles.plus}>+</Text>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  artwork: {
    width: CARD_WIDTH,
    height: ARTWORK_HEIGHT,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ACCENT_WIDTH,
    height: ACCENT_HEIGHT,
    borderRadius: 16,
    transform: [{ rotate: ACCENT_ROTATION }],
  },
  card: {
    position: 'absolute',
    top: CARD_TOP,
    left: 0,
  },
  plus: {
    position: 'absolute',
    top: CARD_TOP + CARD_HEIGHT / 2 - 16,
    left: CARD_WIDTH / 2 - 10,
    fontSize: 28,
    color: colors.grayMedium,
    fontWeight: '300',
  },
  label: {
    fontSize: 13,
    color: colors.brownDarkest,
  },
});

export default GroupCard;
