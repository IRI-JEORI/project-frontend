import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';
import FilterTabs from './components/FilterTabs';
import GroupCard from './components/GroupCard';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';

const TOP_SPACING = 40;
const HORIZONTAL_MARGIN = 20;

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.bannerWrapper}>
        <PromoBanner />
      </View>
      <Text style={styles.sectionTitle}>눈눈님의 그룹</Text>
      <View style={styles.tabsWrapper}>
        <FilterTabs />
      </View>
      <View style={styles.groupRow}>
        <GroupCard label="눈눈" accentColor={colors.mint} />
        <GroupCard label="그룹 추가하기" accentColor={colors.brown} showPlus />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: TOP_SPACING,
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  bannerWrapper: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.brownDarkest,
    marginTop: 24,
  },
  tabsWrapper: {
    marginTop: 12,
  },
  groupRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
});

export default HomeScreen;
