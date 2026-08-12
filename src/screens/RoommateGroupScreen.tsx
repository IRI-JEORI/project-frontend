import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../../App';
import {Colors} from '../constants/Colors';
import RoommateLock from '../assets/images/roommate-lock.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'RoommateGroup'>;

export const RoommateGroupScreen = ({navigation}: Props) => {
  const [complaintVisible, setComplaintVisible] = useState(false);
  const [complaint, setComplaint] = useState('');
  const {width: viewportWidth} = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, {width: contentWidth}]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {left: 28 * scale, top: 17 * scale, width: 24 * scale, height: 24 * scale},
          ]}>
          <Image
            source={require('../assets/images/chevron-left.png')}
            resizeMode="contain"
            style={styles.fill}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {top: 22 * scale}]}>은지눈눈</Text>

        <View
          style={[
            styles.myStatusCard,
            {
              left: 28 * scale,
              top: 94 * scale,
              width: 346 * scale,
              height: 100 * scale,
              borderRadius: 14 * scale,
            },
          ]}>
          <View
            style={[
              styles.meBadge,
              {right: 10 * scale, top: 10 * scale, width: 40 * scale, height: 18 * scale},
            ]}>
            <Text style={styles.meBadgeText}>나</Text>
          </View>
          <StatusMetric value="07:32" label="기상 예정" left={69 * scale} dark />
          <StatusMetric value="4시간째" label="취침 중" left={196 * scale} dark />
        </View>

        <View
          style={[
            styles.roommateCard,
            {
              left: 28 * scale,
              top: 206 * scale,
              width: 346 * scale,
              height: 215 * scale,
              borderRadius: 14 * scale,
            },
          ]}>
          <View
            style={[
              styles.nameBadge,
              {right: 10 * scale, top: 10 * scale, width: 40 * scale, height: 18 * scale},
            ]}>
            <Text style={styles.nameBadgeText}>은지</Text>
          </View>
          <StatusMetric value="20:00" label="예상 귀가" left={72 * scale} top={50 * scale} />
          <StatusMetric value="23:00" label="목표 취침" left={204 * scale} top={50 * scale} />

          <Text style={[styles.cardLabel, {left: 24 * scale, top: 154 * scale}]}>오늘 일정</Text>
          <View style={[styles.privateSchedule, {right: 20 * scale, top: 154 * scale}]}>
            <RoommateLock width={14 * scale} height={14 * scale} />
            <Text style={styles.privateScheduleLabel}>개인 일정</Text>
          </View>
          <Text style={[styles.cardLabel, {left: 24 * scale, top: 182 * scale}]}>내일 기상 목표</Text>
          <Text style={[styles.cardLabel, {right: 20 * scale, top: 182 * scale}]}>07:10</Text>
        </View>

        <View style={[styles.scheduleSection, {left: 28 * scale, top: 452.6 * scale, width: 346 * scale}]}>
          <Text style={styles.sectionTitle}>주요 일정</Text>
          <ScheduleRow day="목" date="6" title="전공 시험 (은지)" time="09:00" scale={scale} />
          <ScheduleRow day="금" date="7" title="개인 일정 (나)" time="종일" scale={scale} />
          <Text style={styles.scheduleGuide}>
            세부 일정 공개 여부는 MY 그룹 일정에서 설정할 수 있어요
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="불만사항 남기기"
          activeOpacity={0.8}
          onPress={() => setComplaintVisible(true)}
          style={[
            styles.complaintButton,
            {bottom: 22 * scale, width: 346 * scale, height: 60 * scale, borderRadius: 8 * scale},
          ]}>
          <Text style={styles.complaintText}>불만사항 남기기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setComplaintVisible(false)}
        statusBarTranslucent
        transparent
        visible={complaintVisible}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="불만사항 창 닫기"
          onPress={() => setComplaintVisible(false)}
          style={styles.sheetOverlay}>
          <Pressable
            onPress={event => event.stopPropagation()}
            style={[
              styles.complaintSheet,
              {
                height: 345 * scale,
                borderTopLeftRadius: 36 * scale,
                borderTopRightRadius: 36 * scale,
              },
            ]}>
            <View
              style={[
                styles.sheetGrabber,
                {top: 5 * scale, width: 36 * scale, height: 5 * scale},
              ]}
            />
            <Text style={[styles.sheetTitle, {left: 31 * scale, top: 40 * scale}]}>
              불만사항을 남겨주세요
            </Text>
            <Text style={[styles.sheetDescription, {left: 31 * scale, top: 68 * scale}]}>
              AI가 다음 알림 멘트에 반영해요
            </Text>
            <TextInput
              accessibilityLabel="불만사항 입력"
              value={complaint}
              onChangeText={setComplaint}
              multiline
              maxLength={300}
              placeholder="예: 알림 소리가 너무 커요"
              placeholderTextColor={Colors.textGray}
              selectionColor={Colors.secondary}
              textAlignVertical="top"
              style={[
                styles.complaintInput,
                {
                  left: 28 * scale,
                  top: 102 * scale,
                  width: 346 * scale,
                  height: 137 * scale,
                  borderRadius: 14 * scale,
                  paddingHorizontal: 19 * scale,
                  paddingTop: 19 * scale,
                },
              ]}
            />
            <View
              style={[
                styles.sheetActions,
                {left: 28 * scale, top: 247 * scale, columnGap: 18 * scale},
              ]}>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={() => {
                  setComplaint('');
                  setComplaintVisible(false);
                }}
                style={[
                  styles.sendButton,
                  {width: 157 * scale, height: 44 * scale, borderRadius: 8 * scale},
                ]}>
                <Text style={styles.sendButtonText}>전송하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={() => setComplaintVisible(false)}
                style={[
                  styles.cancelButton,
                  {width: 171 * scale, height: 44 * scale, borderRadius: 8 * scale},
                ]}>
                <Text style={styles.cancelButtonText}>취소하기</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

type StatusMetricProps = {
  value: string;
  label: string;
  left: number;
  top?: number;
  dark?: boolean;
};

const StatusMetric = ({value, label, left, top = 29, dark}: StatusMetricProps) => (
  <View style={[styles.metric, {left, top}]}>
    <Text style={[styles.metricValue, dark && styles.metricTextDark]}>{value}</Text>
    <Text style={[styles.metricLabel, dark && styles.metricTextDark]}>{label}</Text>
  </View>
);

type ScheduleRowProps = {
  day: string;
  date: string;
  title: string;
  time: string;
  scale: number;
};

const ScheduleRow = ({day, date, title, time, scale}: ScheduleRowProps) => (
  <View style={[styles.scheduleRow, {height: 65 * scale}]}>
    <View style={[styles.dateBox, {width: 38 * scale, height: 38 * scale, borderRadius: 8 * scale}]}>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
    <View style={{marginLeft: 18 * scale}}>
      <Text style={styles.scheduleTitle}>{title}</Text>
      <Text style={styles.scheduleTime}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {flex: 1, alignItems: 'center', backgroundColor: Colors.background},
  container: {flex: 1, position: 'relative', backgroundColor: Colors.background},
  backButton: {position: 'absolute', alignItems: 'center', justifyContent: 'center'},
  fill: {width: '100%', height: '100%'},
  headerTitle: {position: 'absolute', alignSelf: 'center', color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 16, lineHeight: 19},
  myStatusCard: {position: 'absolute', backgroundColor: Colors.secondary, shadowColor: Colors.textBlack, shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.08, shadowRadius: 26.5, elevation: 5},
  roommateCard: {position: 'absolute', backgroundColor: Colors.background, shadowColor: Colors.textBlack, shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.08, shadowRadius: 26.5, elevation: 5},
  meBadge: {position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#897870'},
  meBadgeText: {color: Colors.secondary, fontFamily: 'PretendardBold', fontSize: 12, lineHeight: 15},
  nameBadge: {position: 'absolute', alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.background},
  nameBadgeText: {color: Colors.secondary, fontFamily: 'PretendardBold', fontSize: 12, lineHeight: 15},
  metric: {position: 'absolute', alignItems: 'center'},
  metricValue: {color: Colors.secondary, fontFamily: 'PretendardBold', fontSize: 24, lineHeight: 29},
  metricLabel: {marginTop: 5, color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12, lineHeight: 15},
  metricTextDark: {color: '#897870'},
  cardLabel: {position: 'absolute', color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12, lineHeight: 15},
  privateSchedule: {position: 'absolute', flexDirection: 'row', alignItems: 'center', columnGap: 2},
  privateScheduleLabel: {color: Colors.secondary, fontFamily: 'PretendardSemiBold', fontSize: 12, lineHeight: 15},
  scheduleSection: {position: 'absolute'},
  sectionTitle: {marginBottom: 14, color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14, lineHeight: 17},
  scheduleRow: {flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.gray},
  dateBox: {alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray},
  dayText: {color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 10, lineHeight: 12},
  dateText: {color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14, lineHeight: 17},
  scheduleTitle: {color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 14, lineHeight: 17},
  scheduleTime: {marginTop: 3, color: '#757575', fontFamily: 'PretendardMedium', fontSize: 12, lineHeight: 15},
  scheduleGuide: {marginTop: 7, color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 10, lineHeight: 12, textAlign: 'right'},
  complaintButton: {position: 'absolute', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray},
  complaintText: {color: Colors.textBlack, fontFamily: 'PretendardSemiBold', fontSize: 18, lineHeight: 22},
  sheetOverlay: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.2)'},
  complaintSheet: {width: '100%', backgroundColor: Colors.background, shadowColor: Colors.textBlack, shadowOffset: {width: 0, height: -8}, shadowOpacity: 0.12, shadowRadius: 24, elevation: 20},
  sheetGrabber: {position: 'absolute', alignSelf: 'center', borderRadius: 3, backgroundColor: '#C7C7C7'},
  sheetTitle: {position: 'absolute', color: Colors.textBlack, fontFamily: 'PretendardBold', fontSize: 20, lineHeight: 24},
  sheetDescription: {position: 'absolute', color: Colors.textGray, fontFamily: 'PretendardMedium', fontSize: 14, lineHeight: 17},
  complaintInput: {position: 'absolute', color: Colors.textBlack, backgroundColor: Colors.gray, fontFamily: 'PretendardSemiBold', fontSize: 15, lineHeight: 18, includeFontPadding: false},
  sheetActions: {position: 'absolute', flexDirection: 'row'},
  sendButton: {alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.secondary},
  sendButtonText: {color: Colors.textWhite, fontFamily: 'PretendardSemiBold', fontSize: 16, lineHeight: 19},
  cancelButton: {alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.gray},
  cancelButtonText: {color: Colors.textGray, fontFamily: 'PretendardSemiBold', fontSize: 16, lineHeight: 19},
});
