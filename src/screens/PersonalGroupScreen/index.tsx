import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';
import CountdownCard from './components/CountdownCard';
import NavHeader from './components/NavHeader';
import RecommendationHeadline from './components/RecommendationHeadline';
import TabBar from './components/TabBar';
import WeeklyCard from './components/WeeklyCard';

const TOP_SPACING = 5;

const PersonalGroupScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NavHeader />
      <View style={styles.tabBarWrapper}>
        <TabBar />
      </View>
      <View style={styles.headlineWrapper}>
        <RecommendationHeadline />
      </View>
      <CountdownCard />
      <WeeklyCard />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingTop: TOP_SPACING,
    paddingBottom: 40,
  },
  tabBarWrapper: {
    marginTop: 33,
  },
  headlineWrapper: {
    marginTop: 34,
  },
});

export default PersonalGroupScreen;
