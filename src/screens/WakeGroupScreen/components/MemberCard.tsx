import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/Button';
import { colors } from '../../../theme/tokens';

export interface MemberCardProps {
  name: string;
  wakeTime: string;
  sleepDuration: string;
  buttonLabel: string;
}

const CARD_WIDTH = 164;
const CARD_HEIGHT = 219;

const MemberCard = ({ name, wakeTime, sleepDuration, buttonLabel }: MemberCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        {/* TODO: 실제 인증사진으로 교체 */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarDot} />
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{wakeTime}</Text>
            <Text style={styles.statLabel}>기상 목표</Text>
          </View>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>{sleepDuration}</Text>
            <Text style={styles.statLabel}>취침 중</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button label={buttonLabel} size="medium" />
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
    color: 'rgba(172,172,172,0.85)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(172,172,172,0.85)',
  },
  buttonWrapper: {
    marginTop: 12,
  },
});

export default MemberCard;
