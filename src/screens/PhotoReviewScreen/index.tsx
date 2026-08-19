import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../constants/Colors';

const PhotoReviewScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'PhotoReview'>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'PhotoReview'>>();

  return (
    <View style={styles.container}>
      <Image source={{ uri: params.photoUri }} style={styles.photo} resizeMode="cover" />
      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}>
          <Button label="다시 찍기" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.buttonHalf}>
          <Button
            label="인증사진 올리기"
            variant="secondary"
            onPress={() => {
              params.onComplete(params.photoUri);
              navigation.popTo('WakeGroupDetail');
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  photo: {
    position: 'absolute',
    left: 26,
    top: 91,
    width: 351,
    height: 555,
    borderRadius: 16,
  },
  buttonRow: {
    position: 'absolute',
    left: 27,
    bottom: 18,
    flexDirection: 'row',
    gap: 20,
  },
  buttonHalf: {
    width: 165,
  },
});

export default PhotoReviewScreen;
