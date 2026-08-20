import type { DayOfWeek } from '../api/types';

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

export const formatDayOfWeek = (dayOfWeek: DayOfWeek): string =>
  DAY_OF_WEEK_LABELS[dayOfWeek];
