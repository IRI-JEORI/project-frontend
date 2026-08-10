import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../constants/Colors';

const tabs = ['모든 그룹', '깨우기', '룸메이트'];

type FilterTabsProps = {
  activeTab: number;
  setActiveTab: (index: number) => void;
  scale: number;
};

export const FilterTabs = ({activeTab, setActiveTab, scale}: FilterTabsProps) => {
  return (
    <View
      style={[
        styles.container,
        {marginLeft: 34.5 * scale, columnGap: 6.5 * scale},
      ]}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{selected: isActive}}
            activeOpacity={0.75}
            key={tab}
            onPress={() => setActiveTab(index)}
            style={[
              styles.tab,
              {width: 63 * scale, height: 25.421 * scale},
              isActive ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={[
                styles.tabText,
                isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
  },
  inactiveTab: {
    backgroundColor: Colors.gray,
  },
  tabText: {
    fontFamily: 'PretendardSemiBold',
    fontSize: 12,
    lineHeight: 15,
  },
  activeTabText: {
    color: Colors.textWhite,
  },
  inactiveTabText: {
    color: Colors.textGray,
  },
});
