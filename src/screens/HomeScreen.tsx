import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {RootStackParamList} from '../../App';
import {Colors} from '../constants/Colors';
import {FilterTabs} from '../components/FilterTabs';
import {GroupCard} from '../components/GroupCard';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const {width: viewportWidth} = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, {width: contentWidth}]}>
        <View
          style={[
            styles.brandRow,
            {
              top: 29 * scale,
              paddingHorizontal: 32 * scale,
            },
          ]}>
          <Image
            source={require('../assets/images/nunnun-logo.png')}
            style={{width: 49 * scale, height: 39 * scale}}
            resizeMode="contain"
          />
          <View>
            <Image
              source={require('../assets/images/settings.png')}
              style={{width: 24 * scale, height: 24 * scale}}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text
          style={[
            styles.headerTitle,
            {left: 34.5 * scale, top: 99 * scale},
          ]}>
          눈눈님의 그룹
        </Text>

        <View style={[styles.tabsPosition, {top: 136 * scale}]}>
          <FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scale={scale}
          />
        </View>

        <View
          style={[
            styles.cardsRow,
            {
              top: 232 * scale,
              marginLeft: 33.97 * scale,
              columnGap: 18.69 * scale,
            },
          ]}>
          <GroupCard
            type="normal"
            title="눈눈"
            scale={scale}
          />
          <GroupCard
            type="add"
            title="그룹 추가하기"
            scale={scale}
            onPress={() => navigation.navigate('AddGroup')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  brandRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  tabsPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cardsRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
