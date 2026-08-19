import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import { chevronLeftSvg } from '../../../assets/icons/navIcons';
import { editSvg } from '../../../assets/icons/mypageIcons';
import { colors } from '../../../theme/tokens';

export interface ProfileHeaderProps {
  nickname: string;
  streakText: string;
  onPressBack?: () => void;
  onPressEditAvatar?: () => void;
}

const HEADER_HEIGHT = 355;
const AVATAR_SIZE = 88;
const AVATAR_TOP = 161;

const ProfileHeader = ({
  nickname,
  streakText,
  onPressBack,
  onPressEditAvatar,
}: ProfileHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
        <Icon xml={chevronLeftSvg} size={24} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.avatarWrapper}>
        {/* TODO: 실제 프로필 사진으로 교체 */}
        <View style={styles.avatar} />
        <TouchableOpacity style={styles.editBadge} onPress={onPressEditAvatar}>
          <Icon xml={editSvg} size={14} />
        </TouchableOpacity>
      </View>
      <Text style={styles.nickname}>{nickname}</Text>
      <Text style={styles.streak}>{streakText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.charcoal,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 28,
    top: 76,
    width: 24,
    height: 24,
  },
  avatarWrapper: {
    marginTop: AVATAR_TOP,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 30,
    backgroundColor: colors.grayMedium,
  },
  editBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bannerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    marginTop: 10,
    fontSize: 24,
    fontFamily: 'PretendardBold',
    color: colors.bannerBg,
  },
  streak: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'PretendardMedium',
    color: colors.bannerBg,
  },
});

export default ProfileHeader;
