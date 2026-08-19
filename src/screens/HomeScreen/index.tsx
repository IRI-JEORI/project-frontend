import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useGroups } from '../../context/GroupsContext';
import { colors } from '../../theme/tokens';
import { RootStackParamList } from '../../navigation/types';
import FilterTabs from './components/FilterTabs';
import GroupAddMenu from './components/GroupAddMenu';
import GroupCard from './components/GroupCard';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';

const TOP_SPACING = 14;
const HORIZONTAL_MARGIN = 32;
const BANNER_WIDTH = 346;

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const { groups } = useGroups();

  return (
    <View style={styles.container}>
      <View style={styles.padded}>
        <Header />
      </View>
      <View style={styles.bannerWrapper}>
        <PromoBanner />
      </View>
      <Text style={[styles.sectionTitle, styles.padded]}>눈눈님의 그룹</Text>
      <View style={[styles.tabsWrapper, styles.padded]}>
        <FilterTabs />
      </View>
      <View style={[styles.groupRow, styles.padded]}>
        {groups.map(group => (
          <GroupCard
            key={group.id}
            label={group.label}
            accentColor={group.accentColor}
            onPress={() =>
              navigation.navigate(
                group.id === 'me' ? 'PersonalGroup' : 'WakeGroupDetail',
              )
            }
          />
        ))}
        <GroupCard
          label="그룹 추가하기"
          accentColor={colors.brown}
          showPlus
          onPress={() => setAddMenuVisible(true)}
        />
      </View>
      <GroupAddMenu
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        onPressEnterCode={() => navigation.navigate('InviteCode')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: TOP_SPACING,
  },
  padded: {
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  bannerWrapper: {
    marginTop: 17,
    alignSelf: 'center',
    width: BANNER_WIDTH,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'PretendardBold',
    color: colors.black,
    marginTop: 25,
  },
  tabsWrapper: {
    marginTop: 12,
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 25,
    marginTop: 44,
  },
});

export default HomeScreen;
