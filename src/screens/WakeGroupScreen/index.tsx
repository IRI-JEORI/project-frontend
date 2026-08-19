import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import NavHeader from '../../components/NavHeader';
import PaginationDots from '../../components/PaginationDots';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import { ApiError, nunnunApi } from '../../api';
import type { WakeGroupDetail, WakeGroupMember } from '../../api/types';
import MemberCard from './components/MemberCard';

const CARD_ROW_TOP_SPACING = 80;
const CARD_ROW_HORIZONTAL_MARGIN = 26;
const DOTS_TOP_SPACING = 40;

const memberPrimary = (member: WakeGroupMember) =>
  member.state === 'AWAKE' ? member.actual_wake_time ?? '--:--' : member.target_wake_time ?? '--:--';

const WakeGroupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'WakeGroupDetail'>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'WakeGroupDetail'>>();
  const [detail, setDetail] = useState<WakeGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      setDetail(await nunnunApi.group.detail(params.groupId));
    } catch {
      setDetail(null);
      setErrorMessage('그룹 정보를 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, [params.groupId]);

  useFocusEffect(useCallback(() => { load().catch(() => undefined); }, [load]));

  const wake = async (member: WakeGroupMember) => {
    if (!member.can_wake) return;
    try {
      await nunnunApi.wake.wakeMember(params.groupId, member.user_id);
      await load();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '깨우기 요청을 보내지 못했어요.';
      Alert.alert('깨우기 실패', message);
    }
  };

  const selfVerify = async (member: WakeGroupMember) => {
    try {
      const created = await nunnunApi.wake.startSelfVerify();
      navigation.navigate('CameraCapture', {
        recipientName: member.nickname,
        photographer: 'jiwoo',
        requestId: created.wake_request_id,
        groupId: params.groupId,
        verificationMode: 'self-verify',
      });
    } catch (error) {
      Alert.alert('셀프 인증 실패', error instanceof ApiError ? error.message : '셀프 인증을 시작하지 못했어요.');
    }
  };

  if (loading) {
    return <View style={styles.feedback}><ActivityIndicator color={colors.black} /></View>;
  }
  if (!detail || errorMessage) {
    return <View style={styles.feedback}><Text style={styles.error}>{errorMessage}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <NavHeader
        title={detail.name}
        rightIcon="menu"
        onPressBack={() => navigation.goBack()}
        onPressRight={() =>
          Alert.alert(detail.name, `초대 코드: ${detail.invite_code}`, [
            { text: '닫기', style: 'cancel' },
            {
              text: '그룹 관리',
              onPress: () => navigation.navigate('WaitingForMembers', {
                groupId: detail.id,
                groupType: 'wake',
                groupName: detail.name,
              }),
            },
          ])
        }
      />
      <View style={styles.cardRow}>
        {detail.members.map(member => {
          const awake = member.state === 'AWAKE';
          return (
            <MemberCard
              key={member.user_id}
              name={member.nickname}
              status={awake ? 'done' : 'pending'}
              primaryValue={memberPrimary(member)}
              primaryLabel={awake ? '기상 시간' : '기상 목표'}
              secondaryValue={member.state === 'NEEDS_HELP' ? '도움 필요' : member.remaining_to_target ? `${member.remaining_to_target.value}${member.remaining_to_target.unit === 'HOUR' ? '시간' : '분'}` : '--'}
              secondaryLabel={member.state === 'SLEEPING' ? '취침 중' : member.state}
              actionLabel={member.is_me ? '셀프 인증' : member.can_wake ? '깨우기' : member.block_reason === 'DND' ? '방해금지' : '대기 중'}
              onPressAction={member.is_me ? () => selfVerify(member) : () => wake(member)}
              photoUri={member.proof_image_url ?? undefined}
            />
          );
        })}
      </View>
      <View style={styles.dotsWrapper}><PaginationDots count={Math.max(1, Math.ceil(detail.members.length / 2))} activeIndex={0} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: CARD_ROW_TOP_SPACING, paddingHorizontal: CARD_ROW_HORIZONTAL_MARGIN },
  dotsWrapper: { alignItems: 'center', marginTop: DOTS_TOP_SPACING },
  feedback: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  error: { color: colors.grayBorder, fontFamily: 'PretendardMedium' },
});

export default WakeGroupScreen;
