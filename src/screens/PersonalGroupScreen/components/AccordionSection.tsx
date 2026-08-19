import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import { chevronDownSvg } from '../../../assets/icons/mypageIcons';
import { colors } from '../../../theme/tokens';

export interface AccordionSectionProps {
  title: string;
  rightLabel?: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

const AccordionSection = ({
  title,
  rightLabel,
  expanded,
  onToggle,
  children,
}: AccordionSectionProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerRight}>
          {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
          <View style={expanded ? styles.chevronExpanded : undefined}>
            <Icon xml={chevronDownSvg} size={20} color={colors.black} />
          </View>
        </View>
      </TouchableOpacity>
      {expanded && children ? <View style={styles.content}>{children}</View> : null}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  rightLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    gap: 6,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 21,
    backgroundColor: colors.bannerBg,
  },
});

export default AccordionSection;
