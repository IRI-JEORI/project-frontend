import { poseImageForCode } from '../poseImage';

describe('pose image mapping', () => {
  it.each([
    ['HAND_CROSS', require('../../assets/images/pose-hand-cross.png')],
    ['FINGER_LIPS', require('../../assets/images/pose-finger-lips.png')],
    ['LOW_CROUCH', require('../../assets/images/pose-low-crouch.png')],
  ])('maps %s to its matching image', (code, expected) => {
    expect(poseImageForCode(code)).toBe(expected);
  });

  it.each([undefined, null, 'UNKNOWN'])('uses a safe fallback for %s', code => {
    expect(poseImageForCode(code)).toBe(
      require('../../assets/images/wake-pose-reference.png'),
    );
  });
});
