export const DEMO_USER_STORAGE_KEY = '@nunnun/demo-user';
export const JIWOO_WAKE_GROUP_STORAGE_KEY = '@nunnun/jiwoo-wake-group-name';
export const MINJU_WAKE_GROUP_STORAGE_KEY = '@nunnun/minju-wake-group-name';
export const WAKE_GROUP_MINJU_JOINED_STORAGE_KEY =
  '@nunnun/wake-group-minju-joined';
export const JIWOO_WAKE_PHOTO_STORAGE_KEY = '@nunnun/jiwoo-wake-photo-path';
export const MINJU_WAKE_PHOTO_STORAGE_KEY = '@nunnun/minju-wake-photo-path';
export const MINJU_WAKE_REQUEST_STORAGE_KEY = '@nunnun/minju-wake-requested';
export const JIWOO_WAKE_REQUEST_STORAGE_KEY = '@nunnun/jiwoo-wake-requested';
export const JIWOO_WAKE_EXHAUSTED_STORAGE_KEY = '@nunnun/jiwoo-wake-exhausted';
export const WAKE_GROUP_INVITE_CODE_STORAGE_KEY =
  '@nunnun/wake-group-invite-code';

export type DemoUser = 'jiwoo' | 'minju';

export const DEMO_USER_NAMES: Record<DemoUser, string> = {
  jiwoo: '눈눈',
  minju: '지우',
};
