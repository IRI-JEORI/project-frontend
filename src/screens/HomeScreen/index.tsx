import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { RootStackParamList } from '../../navigation/types';
import { nunnunApi } from '../../api';
import type { CurrentUser, GroupSummary, MyTodayResponse } from '../../api/types';
import FilterTabs from './components/FilterTabs';
import GroupAddMenu from './components/GroupAddMenu';
import GroupCard, { type GroupCardRef } from './components/GroupCard';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';

const TOP_SPACING = 14;
const HORIZONTAL_MARGIN = 32;
const BANNER_WIDTH = 346;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const addGroupCardRef = useRef<GroupCardRef>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [today, setToday] = useState<MyTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        .then(([profile, groupList, todayData]) => {
          if (!active) return;
          setUser(profile);
          setGroups(groupList.groups.filter(group => group.type === 'WAKE'));
          setToday(todayData);
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

  const todaySubtitle = today?.resolved_target_wake_time
    ? `오늘 목표 기상은 ${today.resolved_target_wake_time}이에요`
    : '시간표를 추가하면 수면 시간을 추천받을 수 있어요';

  const startSleep = async () => {
    if (today?.sleep.status !== 'AWAKE') return;
    try {
      await nunnunApi.me.sleep();
      setToday(await nunnunApi.me.getToday());
    } catch {
      setToday(await nunnunApi.me.getToday());
    }
  };

  const openAddMenu = () => {
    addGroupCardRef.current?.measureInWindow((x, y, width, height) => {
      setAddMenuAnchor({ x, y, width, height });
      setAddMenuVisible(true);
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + TOP_SPACING }]}>
      <View style={styles.padded}>
        <Header />
      </View>
      <View style={styles.bannerWrapper}>
        <PromoBanner
          subtitle={todaySubtitle}
          actionLabel={today?.sleep.status === 'SLEEPING' ? '현재 취침 중이에요' : '잠자기'}
          onPressAction={() => startSleep().catch(() => undefined)}
        />
      </View>
      <Text style={[styles.sectionTitle, styles.padded]}>
        {user ? `${user.nickname}님의 그룹` : '내 그룹'}
      </Text>
      <View style={[styles.tabsWrapper, styles.padded]}>
        <FilterTabs />
      </View>
      {loading ? (
        <ActivityIndicator color={colors.black} style={styles.feedback} />
      ) : errorMessage ? (
        <Text style={[styles.feedback, styles.error]}>{errorMessage}</Text>
      ) : (
        <View style={[styles.groupRow, styles.padded]}>
          <GroupCard
            label="내 정보"
            accentColor={colors.mint}
            onPress={() => navigation.navigate('PersonalGroup')}
          />
          {groups.map(group => (
            <GroupCard
              key={group.id}
              label={group.name}
              accentColor={colors.mint}
              onPress={() =>
                navigation.navigate('WakeGroupDetail', { groupId: group.id })
              }
            />
          ))}
          <GroupCard
            ref={addGroupCardRef}
            label="그룹 추가하기"
            accentColor={colors.brown}
            showPlus
            onPress={openAddMenu}
          />
        </View>
      )}
      <GroupAddMenu
        visible={addMenuVisible}
        anchor={addMenuAnchor}
        onClose={() => setAddMenuVisible(false)}
        onPressCreateRoom={() => navigation.navigate('AddGroupName', { groupType: 'wake' })}
        onPressEnterCode={() => navigation.navigate('InviteCode')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  padded: { paddingHorizontal: HORIZONTAL_MARGIN },
  bannerWrapper: { marginTop: 17, alignSelf: 'center', width: BANNER_WIDTH },
  sectionTitle: { fontSize: 24, fontFamily: 'PretendardBold', color: colors.black, marginTop: 25 },
  tabsWrapper: { marginTop: 12 },
  groupRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 25, marginTop: 44 },
  feedback: { marginTop: 64, alignSelf: 'center' },
  error: { color: colors.grayBorder, fontFamily: 'PretendardMedium' },
});

export default HomeScreen;
