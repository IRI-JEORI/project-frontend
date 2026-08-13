import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../components/Button';
import { colors } from '../../theme/tokens';
import CountdownCard from './components/CountdownCard';
import NavHeader from './components/NavHeader';
import RecommendationHeadline from './components/RecommendationHeadline';
import ReturnTimeSheet from './components/ReturnTimeSheet';
import ScheduleGrid from './components/ScheduleGrid';
import TabBar from './components/TabBar';
import WeeklyCard from './components/WeeklyCard';

const TOP_SPACING = 5;
const TAB_LABELS = ['오늘', '내 고정 시간표'];

const PersonalGroupScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <NavHeader
          title={TAB_LABELS[selectedTab]}
          showAddButton={selectedTab === 1}
        />
        <View style={styles.tabBarWrapper}>
          <TabBar selected={selectedTab} onSelect={setSelectedTab} />
        </View>

        {selectedTab === 0 ? (
          <>
            <View style={styles.headlineWrapper}>
              <RecommendationHeadline />
            </View>
            <CountdownCard />
            <WeeklyCard onPressChangeTime={() => setSheetVisible(true)} />
          </>
        ) : (
          <View style={styles.scheduleTabContent}>
            <View style={styles.gridWrapper}>
              <ScheduleGrid />
            </View>
            <View style={styles.addButtonWrapper}>
              <Button label="고정 시간 추가하기" />
            </View>
          </View>
        )}
      </ScrollView>
      <ReturnTimeSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingTop: TOP_SPACING,
    paddingBottom: 40,
  },
  tabBarWrapper: {
    marginTop: 33,
  },
  headlineWrapper: {
    marginTop: 34,
  },
  scheduleTabContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridWrapper: {
    marginTop: 62,
  },
  addButtonWrapper: {
    paddingHorizontal: 28,
  },
});

export default PersonalGroupScreen;
