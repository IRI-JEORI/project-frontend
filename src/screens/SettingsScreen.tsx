import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ScrollView } from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [healthEnabled, setHealthEnabled] = useState(false);
  const [everytimeEnabled, setEverytimeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.textBlack} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Edit */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>프로필 변경</Text>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke={Colors.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        
        <View style={styles.divider} />

        {/* Section: Integrations */}
        <Text style={styles.sectionTitle}>앱 연동</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowText}>캘린더 연동</Text>
          <Switch
            trackColor={{ false: '#EAEAEA', true: '#34C759' }}
            thumbColor={'#FFFFFF'}
            onValueChange={setCalendarEnabled}
            value={calendarEnabled}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>애플헬스 연동</Text>
          <Switch
            trackColor={{ false: '#EAEAEA', true: '#34C759' }}
            thumbColor={'#FFFFFF'}
            onValueChange={setHealthEnabled}
            value={healthEnabled}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>에브리타임 연동</Text>
          <Switch
            trackColor={{ false: '#EAEAEA', true: '#34C759' }}
            thumbColor={'#FFFFFF'}
            onValueChange={setEverytimeEnabled}
            value={everytimeEnabled}
          />
        </View>
        
        <Text style={styles.infoText}>
          세부 일정 공개 여부는 MY 그룹 일정에서 설정할 수 있어요
        </Text>

        <View style={styles.divider} />
        
        <Text style={styles.subInfoText}>
          3번 이상 재설정 시 2주 뒤에 변경이 가능해요
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 56,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textBlack,
    fontFamily: 'Pretendard',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textBlack,
    fontFamily: 'Pretendard',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textGray,
    marginBottom: 8,
    fontFamily: 'Pretendard',
  },
  infoText: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 8,
    fontFamily: 'Pretendard',
    lineHeight: 18,
  },
  subInfoText: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: -8,
    fontFamily: 'Pretendard',
  },
});
