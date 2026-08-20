export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type User = {
  id: number;
  nickname: string;
  avatar_url: string | null;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type DemoLoginResponse = AuthTokens & { user: User };

export type CurrentUser = {
  id: number;
  nickname: string;
  email: string;
};

export type UpdateCurrentUserRequest = {
  nickname: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
  details?: unknown;
};

export type WakeTarget = {
  day_of_week: DayOfWeek;
  display_day: string;
  target_wake_time: string | null;
};

export type WakeTargetUpdated = {
  day_of_week: DayOfWeek;
  target_wake_time: string;
  display_text: string;
};

export type DndWindow = {
  id: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  display_text: string;
};

export type GroupSummary = {
  id: number;
  type: 'WAKE' | 'ROOMMATE';
  name: string;
  status: 'WAITING' | 'ACTIVE' | null;
};

export type WakeGroupSummary = {
  id: number;
  name: string;
  invite_code?: string;
  capacity: number;
  current_members: number;
};

export type RemainingToTarget = {
  value: number;
  unit: 'HOUR' | 'MINUTE';
};

export type WakeMemberState = 'NORMAL' | 'AWAKE' | 'SLEEPING' | 'NEEDS_HELP';

export type WakeGroupMember = {
  user_id: number;
  nickname: string;
  avatar_url: string | null;
  is_me: boolean;
  target_wake_time: string | null;
  next_target_at: string | null;
  remaining_to_target: RemainingToTarget | null;
  state: WakeMemberState;
  actual_wake_time: string | null;
  proof_image_url: string | null;
  proof_expires_at: string | null;
  can_wake: boolean;
  block_reason: 'DND' | 'COOLDOWN' | null;
  wake_available_at: string | null;
};

export type WakeGroupDetail = {
  id: number;
  name: string;
  invite_code: string;
  capacity: number;
  current_members: number;
  members: WakeGroupMember[];
};

export type WakeGroupCreated = {
  id: number;
  name: string;
  invite_code: string;
  capacity: number;
  current_members: number;
};

export type WakeGroupUpdated = {
  id: number;
  name: string;
};

export type WakeGroupPreview = {
  valid: boolean;
  reason:
    | 'INVALID_CODE'
    | 'GROUP_FULL'
    | 'WAKE_GROUP_LIMIT_REACHED'
    | 'ALREADY_MEMBER'
    | null;
  group_name: string | null;
  current_members: number | null;
  capacity: number | null;
};

export type WakeGroupJoinResult = {
  id: number;
  name: string;
};

export type Pose = {
  date: string;
  code: string;
  description: string;
};

export type WakeRequest = {
  id: number;
  group_id: number;
  status: 'SENT' | 'VERIFIED' | 'NEEDS_HELP';
  sender: Pick<User, 'id' | 'nickname'>;
  receiver: Pick<User, 'id' | 'nickname'>;
  requested_at: string;
  pose: Pose;
  attempts_used: number;
  remaining_attempts: number;
};

export type WakeRequestCreated = {
  wake_request_id: number;
  status: 'SENT';
  requested_at: string;
};

export type SelfVerifyCreated = {
  wake_request_id: number;
  status: 'SENT';
  self_verify: true;
  pose: Pose;
};

export type WakeProofResult = {
  wake_request_id: number;
  attempt_no: number;
  pose_match_score: number;
  pose_match_result: 'SUCCESS' | 'FAIL';
  request_status: 'SENT' | 'VERIFIED' | 'NEEDS_HELP';
  can_retry: boolean;
  remaining_attempts: number;
  verified_at?: string;
  cooldown_until?: string;
  proof_expires_at?: string;
};

export type FixedSchedule = {
  id: number;
  title: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type CreateFixedScheduleRequest = {
  title: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type UpdateFixedScheduleRequest = Partial<CreateFixedScheduleRequest>;

export type TodaySleepStatus = 'AWAKE' | 'SLEEPING';

export type TodaySleep = {
  status: TodaySleepStatus;
  sleep_session_id: number | null;
  started_at: string | null;
};

export type MyTodayResponse = {
  date: string;
  targetBedTime: string | null;
  targetWakeTime: string | null;
  estimatedReturnTime: string | null;
  fixedSchedules: FixedSchedule[];
  resolved_target_wake_time: string | null;
  next_target_at: string | null;
  sleep: TodaySleep;
};

export type CreateSleepSessionResponse = {
  sleep_session_id: number;
  started_at: string;
  bedtime_reminders_cancelled: boolean;
};

export type MyStatsResponse = {
  success_rate: number;
  avg_gap_minutes: number;
  streak_days: number;
};

export type JsonObject = Record<string, unknown>;
