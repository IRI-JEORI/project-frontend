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
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 25.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: colors.brown,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.grayBorder,
  },
  labelSelected: {
    color: colors.white,
  },
});

export default FilterTabs;
