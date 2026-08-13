import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const TABS = ['오늘', '내 고정 시간표'];

export interface TabBarProps {
  selected: number;
  onSelect: (index: number) => void;
}

const TabBar = ({ selected, onSelect }: TabBarProps) => {
  return (
    <View>
      <View style={styles.row}>
        {TABS.map((tab, index) => (
          <TouchableOpacity key={tab} onPress={() => onSelect(index)}>
            <Text
              style={[
                styles.label,
                selected === index && styles.labelSelected,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.indicator,
            selected === 1 && styles.indicatorShifted,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 33,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grayBorder,
    paddingBottom: 12,
  },
  labelSelected: {
    color: colors.black,
  },
  track: {
    height: 2,
    backgroundColor: colors.folderGray,
    borderRadius: 8,
    marginHorizontal: 33,
  },
  indicator: {
    width: 53,
    height: 2,
    borderRadius: 8,
    backgroundColor: colors.black,
  },
  indicatorShifted: {
    marginLeft: 53,
    width: 110,
  },
});

export default TabBar;
