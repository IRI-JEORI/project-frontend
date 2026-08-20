import type { ImageSourcePropType } from 'react-native';

const FALLBACK_POSE_IMAGE = require('../assets/images/wake-pose-reference.png');

const POSE_IMAGES: Record<string, ImageSourcePropType> = {
  HAND_CROSS: require('../assets/images/pose-hand-cross.png'),
  FINGER_LIPS: require('../assets/images/pose-finger-lips.png'),
  LOW_CROUCH: require('../assets/images/pose-low-crouch.png'),
};

export const poseImageForCode = (
  code: string | null | undefined,
): ImageSourcePropType => (code ? POSE_IMAGES[code] : undefined) ?? FALLBACK_POSE_IMAGE;
