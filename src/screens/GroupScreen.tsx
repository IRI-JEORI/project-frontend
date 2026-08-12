import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import MemberStatusGray from '../assets/images/member-status-gray.svg';
import MemberStatusYellow from '../assets/images/member-status-yellow.svg';
import MemberStatusLightYellow from '../assets/images/member-status-light-yellow.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Group'>;

type Member = {
  name: string;
  StatusIcon: ComponentType<SvgProps>;
  actionLabel: string;
  delayed?: boolean;
};

const members: Member[] = [
  {
    name: '은지',
    StatusIcon: MemberStatusGray,
    actionLabel: '깨우기',
  },
  {
    name: '윤지',
    StatusIcon: MemberStatusYellow,
    actionLabel: '30분 후 깨우기',
    delayed: true,
  },
  {
    name: '지윤',
    StatusIcon: MemberStatusGray,
    actionLabel: '깨우기',
  },
  {
    name: '지은',
    StatusIcon: MemberStatusLightYellow,
    actionLabel: '깨우기',
  },
];

export const GroupScreen = ({ navigation }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasWokenJiyoon, setHasWokenJiyoon] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  const handleWakeJiyoon = () => {
    if (hasWokenJiyoon) {
      navigation.navigate('AlreadyWoken', { wakerName: '은지' });
      return;
    }

    setHasWokenJiyoon(true);
    navigation.navigate('WakeUp', { wakerName: '은지' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={[
            styles.headerIconButton,
            {
              left: 28 * scale,
              top: 9 * scale,
              width: 24 * scale,
              height: 24 * scale,
            },
          ]}
        >
          <Image
            source={require('../assets/images/chevron-left.png')}
            resizeMode="contain"
            style={styles.fullImage}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { top: 20 * scale }]}>그룹명</Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="그룹 메뉴 열기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => setMenuVisible(true)}
          style={[
            styles.headerIconButton,
            {
              right: 27 * scale,
              top: 11 * scale,
              width: 20 * scale,
              height: 20 * scale,
            },
          ]}
        >
          <Image
            source={require('../assets/images/menu.png')}
            resizeMode="contain"
            style={styles.fullImage}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.memberGrid,
            {
              left: 25 * scale,
              top: 178 * scale,
              width: 351 * scale,
              rowGap: 24 * scale,
              columnGap: 23 * scale,
            },
          ]}
        >
          {members.map(member => (
            <MemberCard
              key={member.name}
              member={member}
              scale={scale}
              onWake={member.name === '지윤' ? handleWakeJiyoon : undefined}
            />
          ))}
        </View>

        <View style={[styles.pageControl, { bottom: 45 * scale }]}>
          <View style={[styles.pageDot, styles.pageDotActive]} />
          <View style={styles.pageDot} />
          <View style={styles.pageDot} />
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        statusBarTranslucent
        transparent
        visible={menuVisible}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="그룹 메뉴 닫기"
          onPress={() => setMenuVisible(false)}
          style={styles.menuOverlay}
        >
          <Pressable
            onPress={event => event.stopPropagation()}
            style={[
              styles.menuPanel,
              {
                right: Math.max(
                  (viewportWidth - contentWidth) / 2 + 28 * scale,
                  20,
                ),
                top: insets.top + 52 * scale,
                width: 250 * scale,
                height: 100 * scale,
                borderRadius: 30 * scale,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>방 나가기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.7}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>방 이름 바꾸기</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

type MemberCardProps = {
  member: Member;
  scale: number;
  onWake?: () => void;
};

const MemberCard = ({ member, scale, onWake }: MemberCardProps) => {
  const StatusIcon = member.StatusIcon;

  return (
    <View
      style={[
        styles.memberCard,
        {
          width: 164 * scale,
          height: 219 * scale,
          borderRadius: 8 * scale,
        },
      ]}
    >
      <View
        style={[
          styles.memberIdentity,
          { left: 9 * scale, top: 9 * scale, columnGap: 3 * scale },
        ]}
      >
        <StatusIcon width={16 * scale} height={16 * scale} />
        <Text style={styles.memberName}>{member.name}</Text>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${member.name} ${member.actionLabel}`}
        activeOpacity={0.8}
        disabled={member.delayed || !onWake}
        onPress={onWake}
        style={[
          styles.wakeButton,
          member.delayed ? styles.delayedButton : styles.activeWakeButton,
          {
            bottom: 17 * scale,
            minWidth: (member.delayed ? 100 : 57) * scale,
            height: 30 * scale,
            borderRadius: 7 * scale,
            paddingHorizontal: 10 * scale,
          },
        ]}
      >
        <Text
          style={[
            styles.wakeButtonText,
            member.delayed
              ? styles.delayedButtonText
              : styles.activeWakeButtonText,
          ]}
        >
          {member.actionLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.background,
  },
  headerIconButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  memberGrid: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberCard: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#DCDCDD',
  },
  memberIdentity: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 8,
    lineHeight: 10,
  },
  wakeButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWakeButton: {
    backgroundColor: Colors.secondary,
  },
  delayedButton: {
    borderWidth: 1,
    borderColor: '#747474',
    backgroundColor: 'transparent',
  },
  wakeButtonText: {
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  activeWakeButtonText: {
    color: Colors.textWhite,
  },
  delayedButtonText: {
    color: '#747474',
  },
  pageControl: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    columnGap: 8,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textGray,
  },
  pageDotActive: {
    backgroundColor: Colors.textBlack,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  menuPanel: {
    position: 'absolute',
    overflow: 'hidden',
    paddingVertical: 7,
    backgroundColor: 'rgba(244, 244, 244, 0.88)',
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  menuItemText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 20,
  },
});
