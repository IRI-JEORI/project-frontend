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
import { colors } from '../constants/Colors';
import {
  DEMO_USER_STORAGE_KEY,
  JIWOO_WAKE_GROUP_STORAGE_KEY,
  MINJU_WAKE_GROUP_STORAGE_KEY,
  type DemoUser,
} from '../constants/DemoUser';
import { GroupCard } from '../components/GroupCard';
import ProfileOutline from '../assets/images/profile-outline.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
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
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
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
          onPress={() => navigation.navigate('Settings')}
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
          {isJiwooInitialHome ? '눈눈님의 그룹' : '지우님의 그룹'}
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
          {isJiwooInitialHome && jiwooWakeGroupName && (
            <GroupCard
              type="normal"
              title={jiwooWakeGroupName}
              scale={scale}
              backColor="#292828"
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
              backColor="#292828"
              onPress={() =>
                navigation.navigate('WaitingForMembers', {
                  groupType: 'wake',
                  groupName: minjuWakeGroupName,
                  viewer: 'minju',
                })
              }
            />
          )}
          <GroupCard
            type="add"
            title="그룹 추가하기"
            scale={scale}
            onPress={() => setAddGroupMenuVisible(true)}
          />
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
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    color: colors.black,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  addGroupMenu: {
    overflow: 'hidden',
    paddingVertical: 7,
    backgroundColor: 'rgba(244, 244, 244, 0.94)',
    shadowColor: colors.black,
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
    color: colors.black,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 20,
  },
});
