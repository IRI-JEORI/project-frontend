import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import { tokenStorage } from '../../api/tokenStorage';
import ProfileHeader from './components/ProfileHeader';
import AccordionSection from './components/AccordionSection';
import ScheduleRow from './components/ScheduleRow';
import AddRowButton from './components/AddRowButton';
import SettingsRow from './components/SettingsRow';
import AddScheduleMethodModal from './components/AddScheduleMethodModal';
import ManualScheduleSheet from './components/ManualScheduleSheet';
import LogoutConfirmModal from './components/LogoutConfirmModal';

type ScheduleTarget = 'FIXED' | 'DND';

const SECTION_KEYS = ['FIXED', 'DND', 'SETTINGS', 'REWARD'] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

const PersonalGroupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'PersonalGroup'>>();

  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set());
  const [fixedSchedules, setFixedSchedules] = useState<string[]>([
    '월요일 10:00 수업',
    '화요일 10:00 수업',
  ]);
  const [dndWindows, setDndWindows] = useState<string[]>(['일요일 08:00~11:00']);
  const [nudgeEnabled, setNudgeEnabled] = useState(true);

  const [methodModalTarget, setMethodModalTarget] = useState<ScheduleTarget | null>(null);
  const [manualSheetTarget, setManualSheetTarget] = useState<ScheduleTarget | null>(null);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleSection = (key: SectionKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleConfirmManual = () => {
    const target = methodModalTarget;
    setMethodModalTarget(null);
    setManualSheetTarget(target);
  };

  const handleManualConfirm = (value: string) => {
    if (manualSheetTarget === 'FIXED') {
      setFixedSchedules((prev) => [...prev, value]);
    } else if (manualSheetTarget === 'DND') {
      setDndWindows((prev) => [...prev, value]);
    }
    setManualSheetTarget(null);
  };

  const handleLogout = async () => {
    await tokenStorage.clear();
    setLogoutModalVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ProfileHeader
          nickname="눈눈"
          streakText="이번 주 5일 연속 기상 성공"
          onPressBack={() => navigation.goBack()}
        />

        <View style={styles.sections}>
          <AccordionSection
            title="내 고정 시간표"
            expanded={expandedSections.has('FIXED')}
            onToggle={() => toggleSection('FIXED')}
          >
            {fixedSchedules.map((item) => (
              <ScheduleRow key={item} label={item} />
            ))}
            <AddRowButton
              label="시간표 추가하기"
              onPress={() => setMethodModalTarget('FIXED')}
            />
          </AccordionSection>

          <AccordionSection
            title="방해금지 시간대"
            rightLabel={`자동 ${dndWindows.length}개 적용 중이에요`}
            expanded={expandedSections.has('DND')}
            onToggle={() => toggleSection('DND')}
          >
            {dndWindows.map((item) => (
              <ScheduleRow key={item} label={item} />
            ))}
            <AddRowButton
              label="방해금지 시간대 추가하기"
              onPress={() => setMethodModalTarget('DND')}
            />
          </AccordionSection>

          <AccordionSection
            title="설정"
            expanded={expandedSections.has('SETTINGS')}
            onToggle={() => toggleSection('SETTINGS')}
          >
            <SettingsRow label="로그아웃" onPress={() => setLogoutModalVisible(true)} />
            <SettingsRow
              label="취침 넛지 알림"
              toggleValue={nudgeEnabled}
              onToggleChange={setNudgeEnabled}
            />
          </AccordionSection>

          <AccordionSection
            title="내 리워드"
            expanded={expandedSections.has('REWARD')}
            onToggle={() => toggleSection('REWARD')}
          >
            <ScheduleRow label="아직 받은 리워드가 없어요" />
          </AccordionSection>
        </View>

        <AddRowButton
          label="목표 기상 시간 설정하기"
          onPress={() => Alert.alert('준비 중이에요', '곧 만나볼 수 있어요.')}
        />
      </ScrollView>

      <AddScheduleMethodModal
        visible={methodModalTarget !== null}
        onClose={() => setMethodModalTarget(null)}
        onConfirmManual={handleConfirmManual}
      />
      <ManualScheduleSheet
        visible={manualSheetTarget !== null}
        target={manualSheetTarget ?? 'FIXED'}
        onClose={() => setManualSheetTarget(null)}
        onConfirm={handleManualConfirm}
      />
      <LogoutConfirmModal
        visible={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
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
    paddingBottom: 40,
  },
  sections: {
    marginTop: 24,
  },
});

export default PersonalGroupScreen;
