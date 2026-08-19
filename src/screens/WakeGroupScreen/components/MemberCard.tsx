import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/Button';
import { colors } from '../../../constants/Colors';

export interface MemberCardProps {
  name: string;
  status: 'pending' | 'done';
  primaryValue: string;
  primaryLabel: string;
  secondaryValue: string;
  secondaryLabel: string;
  actionLabel: string;
  onPressAction?: () => void;
  photoUri?: string;
}

const CARD_WIDTH = 164;
const CARD_HEIGHT = 219;

const MemberCard = ({
  name,
  status,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  actionLabel,
  onPressAction,
  photoUri,
}: MemberCardProps) => {
  const isDone = status === 'done';
  const textColor = isDone ? colors.brown : 'rgba(172,172,172,0.85)';

  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.photoImage}
            resizeMode="cover"
          />
        ) : (
          // TODO: 실제 인증사진으로 교체
          <View style={styles.photoPlaceholder} />
        )}
        <View style={styles.avatarRow}>
          <View style={styles.avatarDot} />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: textColor }]}>
              {primaryValue}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>
              {primaryLabel}
            </Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={[styles.statValue, { color: textColor }]}>
              {secondaryValue}
            </Text>
            <Text style={[styles.statLabel, { color: textColor }]}>
              {secondaryLabel}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label={actionLabel}
          size="medium"
          onPress={isDone ? undefined : onPressAction}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
  },
  photo: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    backgroundColor: colors.scheduleGridGray,
    justifyContent: 'space-between',
    padding: 13,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scheduleGridGray,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gray,
  },
  name: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    alignItems: 'flex-start',
    gap: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  buttonWrapper: {
    marginTop: 12,
  },
});

export default MemberCard;
