import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import Icon from '../../components/Icon';
import { closeSvg, flashSvg } from '../../assets/icons/navIcons';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';

const CameraCaptureScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'CameraCapture'>
    >();
  const { params } = useRoute<RouteProp<RootStackParamList, 'CameraCapture'>>();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  const photoOutput = usePhotoOutput();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch(() => undefined);
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    if (isTakingPhoto) {
      return;
    }
    setIsTakingPhoto(true);
    try {
      const photo = await photoOutput.capturePhotoToFile(
        { flashMode: flashEnabled && device?.hasFlash ? 'on' : 'off' },
        {},
      );
      navigation.navigate('PhotoReview', {
        photoUri: `file://${photo.filePath}`,
        memberName: params.memberName,
        onComplete: params.onComplete,
      });
    } finally {
      setIsTakingPhoto(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon xml={closeSvg} size={24} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.flashButton}
        onPress={() => setFlashEnabled(enabled => !enabled)}
      >
        <Icon
          xml={flashSvg}
          size={24}
          color={flashEnabled ? colors.yellow : colors.white}
        />
      </TouchableOpacity>

      <View style={styles.previewFrame}>
        {hasPermission && device ? (
          <Camera
            device={device}
            isActive={isFocused}
            outputs={[photoOutput]}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={styles.previewFallback}>
            {!hasPermission ? (
              <Text style={styles.previewMessage}>
                카메라 권한을 허용해주세요
              </Text>
            ) : (
              <ActivityIndicator color={colors.white} />
            )}
          </View>
        )}
      </View>

      <Text style={styles.helperText}>
        {params.memberName}님에게 보여줄 인증사진이에요
      </Text>

      <TouchableOpacity
        style={styles.shutterOuter}
        disabled={!hasPermission || !device || isTakingPhoto}
        onPress={() => takePhoto().catch(() => undefined)}
      >
        <View style={styles.shutterInner} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 24,
    top: 22,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  flashButton: {
    position: 'absolute',
    right: 25,
    top: 22,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  previewFrame: {
    position: 'absolute',
    left: 25,
    top: 87,
    width: 352,
    height: 546,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.black,
  },
  previewFallback: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewMessage: {
    color: colors.grayBorder,
    fontSize: 14,
    fontFamily: 'PretendardSemiBold',
  },
  helperText: {
    position: 'absolute',
    top: 660,
    alignSelf: 'center',
    color: colors.grayBorder,
    fontSize: 14,
    fontFamily: 'PretendardSemiBold',
  },
  shutterOuter: {
    position: 'absolute',
    top: 704,
    alignSelf: 'center',
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.white,
  },
});

export default CameraCaptureScreen;
