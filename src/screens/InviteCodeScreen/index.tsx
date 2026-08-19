import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import NavHeader from '../../components/NavHeader';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import { ApiError, nunnunApi } from '../../api';
import CodeInput from './components/CodeInput';

const CODE_LENGTH = 6;
const TITLE_TOP_SPACING = 62;
const CONTENT_HORIZONTAL_MARGIN = 28;
const BUTTON_BOTTOM_SPACING = 52;

const InviteCodeScreen = () => {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'InviteCode'>>();

  const submit = async () => {
    if (code.length !== CODE_LENGTH || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      const preview = await nunnunApi.group.preview(code);
      if (!preview.valid) {
        Alert.alert('그룹 확인', preview.reason === 'GROUP_FULL' ? '이미 정원이 가득 찬 그룹이에요.' : '참여할 수 없는 초대코드예요.');
        return;
      }
      const joined = await nunnunApi.group.join(code);
      navigation.replace('WakeGroupDetail', { groupId: joined.id });
    } catch (error) {
      Alert.alert('그룹 참여 실패', error instanceof ApiError ? error.message : '그룹에 참여하지 못했어요.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavHeader title="" onPressBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>초대 코드를 입력해주세요</Text>
        <Text style={styles.subtitle}>코드를 입력하면 그룹에 참여할 수 있어요</Text>
        <View style={styles.codeWrapper}>
          <CodeInput value={code} onChangeText={value => setCode(value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())} length={CODE_LENGTH} />
        </View>
      </View>
      <View style={styles.spacer} />
      <View style={styles.buttonWrapper}>
        <Button label={submitting ? '확인 중...' : '그룹 들어가기'} onPress={() => submit().catch(() => undefined)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { marginTop: TITLE_TOP_SPACING, paddingHorizontal: CONTENT_HORIZONTAL_MARGIN },
  title: { fontSize: 24, fontFamily: 'PretendardBold', color: colors.black },
  subtitle: { fontSize: 16, fontFamily: 'PretendardMedium', color: colors.grayBorder, marginTop: 8 },
  codeWrapper: { marginTop: 32 },
  spacer: { flex: 1 },
  buttonWrapper: { paddingHorizontal: CONTENT_HORIZONTAL_MARGIN, paddingBottom: BUTTON_BOTTOM_SPACING },
});

export default InviteCodeScreen;
