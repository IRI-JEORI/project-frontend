export const DEMO_USER_STORAGE_KEY = '@nunnun/demo-user';
export const DEMO_SCHEDULE_STATUS_STORAGE_KEYS = {
  jiwoo: '@nunnun/demo-schedule-status/jiwoo',
  minju: '@nunnun/demo-schedule-status/minju',
} as const;
export const JIWOO_WAKE_GROUP_STORAGE_KEY = '@nunnun/jiwoo-wake-group-name';
export const MINJU_WAKE_GROUP_STORAGE_KEY = '@nunnun/minju-wake-group-name';
export const WAKE_GROUP_MINJU_JOINED_STORAGE_KEY =
  '@nunnun/wake-group-minju-joined';
export const JIWOO_WAKE_PHOTO_STORAGE_KEY = '@nunnun/jiwoo-wake-photo-path';
export const MINJU_WAKE_PHOTO_STORAGE_KEY = '@nunnun/minju-wake-photo-path';
export const MINJU_WAKE_REQUEST_STORAGE_KEY = '@nunnun/minju-wake-requested';
export const JIWOO_WAKE_REQUEST_STORAGE_KEY = '@nunnun/jiwoo-wake-requested';
export const JIWOO_WAKE_EXHAUSTED_STORAGE_KEY = '@nunnun/jiwoo-wake-exhausted';
export const JIWOO_WAKE_SUCCESS_STORAGE_KEY = '@nunnun/jiwoo-wake-success';
export const MINJU_WAKE_SUCCESS_STORAGE_KEY = '@nunnun/minju-wake-success';
export const WAKE_GROUP_INVITE_CODE_STORAGE_KEY =
  '@nunnun/wake-group-invite-code';
export const AI_FRIEND_PROMPT_STORAGE_KEY = '@nunnun/ai-friend-prompt-user';
export const AI_FRIEND_ENABLED_STORAGE_KEYS = {
  jiwoo: '@nunnun/ai-friend-enabled/jiwoo',
  minju: '@nunnun/ai-friend-enabled/minju',
} as const;

export type DemoUser = 'jiwoo' | 'minju';
export type DemoScheduleStatus = 'inClass' | 'available';

export const DEMO_USER_NAMES: Record<DemoUser, string> = {
  jiwoo: '눈눈',
  minju: '지우',
};

export const DEMO_SCHEDULE_STATUS_NAMES: Record<DemoScheduleStatus, string> = {
  inClass: '수업 중',
  available: '수업 아님',
};
