import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/tokens';
import FilterTabs from './components/FilterTabs';
import GroupCard from './components/GroupCard';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';

const TOP_SPACING = 14;
const HORIZONTAL_MARGIN = 32;
const BANNER_WIDTH = 346;

const HomeScreen = () => {
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
    fontWeight: '700',
    color: colors.black,
    marginTop: 25,
  },
  tabsWrapper: {
    marginTop: 12,
  },
  groupRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 44,
  },
});

export default HomeScreen;
