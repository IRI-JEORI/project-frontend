import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { nunnunApi } from '../api';
import type { CurrentUser, GroupSummary } from '../api/types';
import { Colors } from '../constants/Colors';
import { GroupCard } from '../components/GroupCard';
import ProfileOutline from '../assets/images/profile-outline.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const addGroupCardRef = useRef<View>(null);
  const [addGroupMenuVisible, setAddGroupMenuVisible] = useState(false);
  const [addGroupMenuAnchor, setAddGroupMenuAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setErrorMessage(null);

      Promise.all([
        nunnunApi.user.getMe(),
        nunnunApi.group.list(),
        nunnunApi.me.getToday(),
      ])
        .then(([profile, groupList]) => {
          if (!active) return;
          setUser(profile);
          setGroups(groupList.groups.filter(group => group.type === 'WAKE'));
        })
        .catch(() => {
          if (active) setErrorMessage('홈 정보를 불러오지 못했어요.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const openAddGroupMenu = () => {
    addGroupCardRef.current?.measureInWindow((x, y, width, height) => {
      setAddGroupMenuAnchor({ x, y, width, height });
      setAddGroupMenuVisible(true);
    });
  };

  const menuWidth = 250 * scale;
  const menuGap = 8;
  const screenEdgeGap = 8;
  const menuRight = addGroupMenuAnchor
    ? addGroupMenuAnchor.x + addGroupMenuAnchor.width + menuGap
    : screenEdgeGap;
  const menuLeft = addGroupMenuAnchor
    ? menuRight + menuWidth <= viewportWidth - screenEdgeGap
      ? menuRight
      : Math.max(
          screenEdgeGap,
          addGroupMenuAnchor.x - menuWidth - menuGap,
        )
    : screenEdgeGap;
  const menuTop = addGroupMenuAnchor?.y ?? screenEdgeGap;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <Image
          source={require('../assets/images/nunnun-logo.png')}
          style={[
            styles.logo,
            {
              left: 32 * scale,
              top: 29 * scale,
              width: 49 * scale,
              height: 39 * scale,
            },
          ]}
          resizeMode="contain"
        />

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="프로필 및 설정"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.navigate('PersonalGroup')}
          style={[
            styles.profileButton,
            {
              right: 35 * scale,
              top: 39 * scale,
              width: 18 * scale,
              height: 18 * scale,
            },
          ]}
        >
          <ProfileOutline width={18 * scale} height={18 * scale} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { left: 36 * scale, top: 99 * scale }]}
        >
          {user ? `${user.nickname}님의 그룹` : '내 그룹'}
        </Text>

        <View
          style={[
            styles.cardsGrid,
            {
              left: 32 * scale,
              top: 232 * scale,
              width: 332 * scale,
              columnGap: 24 * scale,
              rowGap: 45 * scale,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textBlack} />
          ) : errorMessage ? (
            <Text style={styles.feedbackText}>{errorMessage}</Text>
          ) : (
            <>
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  type="normal"
                  title={group.name}
                  scale={scale}
                  backColor="#292828"
                  onPress={() =>
                    navigation.navigate('WakeGroupDetail', {
                      groupId: group.id,
                    })
                  }
                />
              ))}
              <View ref={addGroupCardRef} collapsable={false}>
                <GroupCard
                  type="add"
                  title="그룹 추가하기"
                  scale={scale}
                  onPress={openAddGroupMenu}
                />
              </View>
            </>
          )}
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setAddGroupMenuVisible(false)}
        navigationBarTranslucent
        statusBarTranslucent
        transparent
        visible={addGroupMenuVisible && addGroupMenuAnchor !== null}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="그룹 추가 메뉴 닫기"
          onPress={() => setAddGroupMenuVisible(false)}
          style={styles.addGroupMenuOverlay}
        >
          <Pressable
            onPress={event => event.stopPropagation()}
            style={[
              styles.addGroupMenu,
              {
                left: menuLeft,
                top: menuTop,
                width: 250 * scale,
                height: 100 * scale,
                borderRadius: 30 * scale,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="방 생성하기"
              activeOpacity={0.7}
              onPress={() => {
                setAddGroupMenuVisible(false);
                navigation.navigate('AddGroupName', { groupType: 'wake' });
              }}
              style={styles.addGroupMenuItem}
            >
              <Text style={styles.addGroupMenuText}>방 생성하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="초대 코드 입력하기"
              activeOpacity={0.7}
              onPress={() => {
                setAddGroupMenuVisible(false);
                navigation.navigate('InviteCode');
              }}
              style={styles.addGroupMenuItem}
            >
              <Text style={styles.addGroupMenuText}>초대 코드 입력하기</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
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
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
  },
  profileButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  cardsGrid: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  addGroupMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  addGroupMenu: {
    position: 'absolute',
    overflow: 'hidden',
    paddingVertical: 7,
    backgroundColor: 'rgba(244, 244, 244, 0.94)',
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  addGroupMenuItem: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  addGroupMenuText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 20,
  },
  feedbackText: {
    width: '100%',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    textAlign: 'center',
  },
});
