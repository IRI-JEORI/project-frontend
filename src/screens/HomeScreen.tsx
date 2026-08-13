import React, { useCallback, useState } from 'react';
import {
  Image,
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
import { DEMO_USER_STORAGE_KEY, type DemoUser } from '../constants/DemoUser';
import { FilterTabs } from '../components/FilterTabs';
import { GroupCard } from '../components/GroupCard';
import NotificationBell from '../assets/images/notification-bell.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [demoUser, setDemoUser] = useState<DemoUser>('jiwoo');
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      AsyncStorage.getItem(DEMO_USER_STORAGE_KEY)
        .then(savedUser => {
          if (isActive && (savedUser === 'jiwoo' || savedUser === 'minju')) {
            setDemoUser(savedUser);
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
          {isJiwooInitialHome ? '지우님의 그룹' : '눈눈님의 그룹'}
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
              width: 326.69 * scale,
              columnGap: 18.69 * scale,
              rowGap: 53 * scale,
            },
          ]}
        >
          {isJiwooInitialHome ? (
            <GroupCard
              type="normal"
              title="지우"
              scale={scale}
              backColor="#C7ECEC"
            />
          ) : (
            <>
              <GroupCard
                type="normal"
                title="눈눈"
                scale={scale}
                onPress={() => navigation.navigate('Group')}
              />
              <GroupCard
                type="normal"
                title="은지눈눈"
                scale={scale}
                onPress={() => navigation.navigate('RoommateGroup')}
              />
              <GroupCard type="normal" title="눈눈" scale={scale} />
            </>
          )}
          <GroupCard
            type="add"
            title="그룹 추가하기"
            scale={scale}
            onPress={() => navigation.navigate('AddGroup')}
          />
        </View>
      </View>
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
});
