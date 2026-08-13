import React, { useCallback, useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  DEMO_USER_STORAGE_KEY,
  JIWOO_WAKE_GROUP_STORAGE_KEY,
  MINJU_WAKE_GROUP_STORAGE_KEY,
  type DemoUser,
} from '../constants/DemoUser';
import { FilterTabs } from '../components/FilterTabs';
import { GroupCard } from '../components/GroupCard';
import NotificationBell from '../assets/images/notification-bell.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [addGroupMenuVisible, setAddGroupMenuVisible] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser>('jiwoo');
  const [jiwooWakeGroupName, setJiwooWakeGroupName] = useState<string | null>(
    null,
  );
  const [minjuWakeGroupName, setMinjuWakeGroupName] = useState<string | null>(
    null,
  );
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      Promise.all([
        AsyncStorage.getItem(DEMO_USER_STORAGE_KEY),
        AsyncStorage.getItem(JIWOO_WAKE_GROUP_STORAGE_KEY),
        AsyncStorage.getItem(MINJU_WAKE_GROUP_STORAGE_KEY),
      ])
        .then(([savedUser, savedWakeGroupName, savedMinjuWakeGroupName]) => {
          if (isActive && (savedUser === 'jiwoo' || savedUser === 'minju')) {
            setDemoUser(savedUser);
          }
          if (isActive) {
            setJiwooWakeGroupName(savedWakeGroupName);
            setMinjuWakeGroupName(savedMinjuWakeGroupName);
          }
        })
        .catch(() => undefined);

      return () => {
        isActive = false;
      };
    }, []),
  );

  const isJiwooInitialHome = demoUser === 'jiwoo';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <View
          style={[
            styles.brandRow,
            {
              top: 29 * scale,
              paddingHorizontal: 32 * scale,
            },
          ]}
        >
          <Image
            source={require('../assets/images/nunnun-logo.png')}
            style={{ width: 49 * scale, height: 39 * scale }}
            resizeMode="contain"
          />
          <View style={[styles.headerActions, { columnGap: 18 * scale }]}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="알림"
              activeOpacity={0.7}
              hitSlop={12}
            >
              <NotificationBell width={20 * scale} height={20 * scale} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="설정"
              activeOpacity={0.7}
              hitSlop={12}
              onPress={() => navigation.navigate('Settings')}
            >
              <Image
                source={require('../assets/images/settings.png')}
                style={{ width: 24 * scale, height: 24 * scale }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.notificationCard,
            {
              left: 28 * scale,
              top: 85 * scale,
              width: 346 * scale,
              height: 69 * scale,
              borderRadius: 8 * scale,
              paddingHorizontal: 12 * scale,
              paddingTop: 14 * scale,
            },
          ]}
        >
          <Text style={styles.notificationEyebrow}>
            NUNNUN을 잘 활용하려면?
          </Text>
          <Text style={styles.notificationMessage}>
            시간표를 추가하면 수면 시간을 추천받을 수 있어요
          </Text>
          <View
            style={[
              styles.notificationDots,
              { right: 14 * scale, top: 8 * scale },
            ]}
          >
            <View
              style={[styles.notificationDot, styles.notificationDotActive]}
            />
            <View style={styles.notificationDot} />
            <View style={styles.notificationDot} />
          </View>
        </View>

        <Text
          style={[styles.headerTitle, { left: 34.5 * scale, top: 190 * scale }]}
        >
          {isJiwooInitialHome ? '지우님의 그룹' : '민주님의 그룹'}
        </Text>

        <View style={[styles.tabsPosition, { top: 227 * scale }]}>
          <FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scale={scale}
          />
        </View>

        <View
          style={[
            styles.cardsGrid,
            {
              left: 33.97 * scale,
              top: 323 * scale,
              width: 332 * scale,
              columnGap: 24 * scale,
              rowGap: 45 * scale,
            },
          ]}
        >
          {activeTab === 0 && (
            <GroupCard
              type="normal"
              title={isJiwooInitialHome ? '지우' : '민주'}
              scale={scale}
              backColor="#C7ECEC"
            />
          )}
          {isJiwooInitialHome && jiwooWakeGroupName && (
            <GroupCard
              type="normal"
              title={jiwooWakeGroupName}
              scale={scale}
              backColor="#C7ECEC"
              onPress={() =>
                navigation.navigate('WaitingForMembers', {
                  groupType: 'wake',
                  groupName: jiwooWakeGroupName,
                })
              }
            />
          )}
          {!isJiwooInitialHome && minjuWakeGroupName && (
            <GroupCard
              type="normal"
              title={minjuWakeGroupName}
              scale={scale}
              backColor="#C7ECEC"
              onPress={() =>
                navigation.navigate('WaitingForMembers', {
                  groupType: 'wake',
                  groupName: minjuWakeGroupName,
                  viewer: 'minju',
                })
              }
            />
          )}
          {activeTab === 0 && (
            <GroupCard
              type="add"
              title="그룹 추가하기"
              scale={scale}
              onPress={() => setAddGroupMenuVisible(true)}
            />
          )}
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setAddGroupMenuVisible(false)}
        statusBarTranslucent
        transparent
        visible={addGroupMenuVisible}
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
  brandRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationCard: {
    position: 'absolute',
    backgroundColor: Colors.background,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 13,
    elevation: 4,
  },
  notificationEyebrow: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 12,
    lineHeight: 15,
  },
  notificationMessage: {
    marginTop: 4,
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  notificationDots: {
    position: 'absolute',
    flexDirection: 'row',
    columnGap: 4,
  },
  notificationDot: {
    width: 4.4,
    height: 4.4,
    borderRadius: 3,
    backgroundColor: '#333333',
    opacity: 0.3,
  },
  notificationDotActive: {
    opacity: 1,
    backgroundColor: Colors.textBlack,
  },
  tabsPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cardsGrid: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  addGroupMenuOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  addGroupMenu: {
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
});
