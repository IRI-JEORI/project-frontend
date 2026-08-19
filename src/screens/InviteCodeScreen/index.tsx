import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import NavHeader from '../../components/NavHeader';
import { useGroups } from '../../context/GroupsContext';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../constants/Colors';
import CodeInput from './components/CodeInput';

const CODE_LENGTH = 6;
const TITLE_TOP_SPACING = 62;
const CONTENT_HORIZONTAL_MARGIN = 28;
const BUTTON_BOTTOM_SPACING = 52;

const InviteCodeScreen = () => {
  const [code, setCode] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'InviteCode'>>();
  const { addGroup } = useGroups();

  return (
    <View style={styles.container}>
      <NavHeader title="" onPressBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>초대 코드를 입력해주세요</Text>
        <Text style={styles.subtitle}>코드를 입력하면 그룹에 참여할 수 있어요</Text>
        <View style={styles.codeWrapper}>
          <CodeInput value={code} onChangeText={setCode} length={CODE_LENGTH} />
        </View>
      </View>
      <View style={styles.spacer} />
      <View style={styles.buttonWrapper}>
        <Button
          label="그룹 들어가기"
          onPress={() => {
            addGroup({ id: 'wake', label: '아침 야호', accentColor: colors.mint });
            navigation.navigate('WakeGroupDetail');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    marginTop: TITLE_TOP_SPACING,
    paddingHorizontal: CONTENT_HORIZONTAL_MARGIN,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.grayBorder,
    marginTop: 8,
  },
  codeWrapper: {
    marginTop: 32,
  },
  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    paddingHorizontal: CONTENT_HORIZONTAL_MARGIN,
    paddingBottom: BUTTON_BOTTOM_SPACING,
  },
});

export default InviteCodeScreen;
