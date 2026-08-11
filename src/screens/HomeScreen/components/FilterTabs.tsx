import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/tokens';

const TABS = ['모든 그룹', '깨우기', '룸메이트'];

const FilterTabs = () => {
  const [selected, setSelected] = useState(0);

  return (
    <View style={styles.row}>
      {TABS.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setSelected(index)}
          style={[styles.tab, selected === index && styles.tabSelected]}
        >
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
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    backgroundColor: colors.folderGray,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabSelected: {
    backgroundColor: colors.brownDarkest,
  },
  label: {
    fontSize: 13,
    color: colors.grayMedium,
  },
  labelSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default FilterTabs;
