// ===== 공통 =====
export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

// ===== Demo Auth =====
export interface DemoAccount {
  id: number;
  nickname: string;
  avatar_url: string | null;
}

export interface DemoAccountsResponse {
  accounts: DemoAccount[];
}

export interface AuthUser {
  id: number;
  nickname: string;
  avatar_url: string | null;
}

export interface DemoLoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface ReissueResponse {
  access_token: string;
  refresh_token: string;
}

// ===== User =====
export interface Me {
  id: number;
  nickname: string;
  email: string | null;
  avatar_url: string | null;
}

// ===== Device =====
export interface RegisterDeviceRequest {
  fcm_token: string;
  platform: 'ANDROID' | 'IOS';
}

export interface RegisterDeviceResponse {
  registered: boolean;
}

// ===== Wake Target =====
export interface WakeTarget {
  day_of_week: DayOfWeek;
  display_day: string;
  target_wake_time: string | null;
}

export interface WakeTargetsResponse {
  targets: WakeTarget[];
}

export interface UpsertWakeTargetRequest {
  text: string;
}

export interface UpsertWakeTargetResponse {
  day_of_week: DayOfWeek;
  target_wake_time: string;
  display_text: string;
}

// ===== DND =====
export interface DndWindow {
  id: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  display_text: string;
}

export interface DndWindowsResponse {
  windows: DndWindow[];
}

export interface CreateDndWindowRequest {
  text: string;
}

// ===== Sleep =====
export type SleepSource = 'APP' | 'NOTIFICATION';

export interface SleepRequest {
  source: SleepSource;
}

export interface SleepResponse {
  sleep_session_id: number;
  started_at: string;
  bedtime_reminders_cancelled: boolean;
}

export type SleepFeedbackScore = 'VERY_BAD' | 'BAD' | 'NORMAL' | 'GOOD' | 'VERY_GOOD';

export interface SleepFeedbackRequest {
  score: SleepFeedbackScore;
}

// ===== Today =====
export interface TodayResponse {
  resolved_target_wake_time: string | null;
  next_target_at: string | null;
  [key: string]: unknown;
}

// ===== Wake Group =====
export interface WakeGroupSummary {
  id: number;
  name: string;
}

export interface GroupsResponse {
  groups: WakeGroupSummary[];
}

export interface CreateWakeGroupRequest {
  name: string;
}

export interface WakeGroup {
  id: number;
  name: string;
  invite_code: string;
  capacity: number;
  current_members: number;
}

export interface WakeGroupPreview {
  valid: boolean;
  reason: 'INVALID_CODE' | 'GROUP_FULL' | 'ALREADY_IN_WAKE_GROUP' | 'ALREADY_MEMBER' | null;
  group_name: string | null;
  current_members: number | null;
  capacity: number | null;
}

export interface JoinWakeGroupRequest {
  invite_code: string;
}

export interface PatchWakeGroupRequest {
  name: string;
}

export interface InviteCodeResponse {
  invite_code: string;
}

export type WakeMemberState = 'NORMAL' | 'AWAKE' | 'SLEEPING' | 'NEEDS_HELP';

export interface WakeGroupMember {
  user_id: number;
  nickname: string;
  avatar_url: string | null;
  is_me: boolean;
  target_wake_time: string | null;
  next_target_at: string | null;
  remaining_to_target: { value: number; unit: 'HOUR' | 'MINUTE' } | null;
  state: WakeMemberState;
  actual_wake_time: string | null;
  proof_image_url: string | null;
  proof_expires_at: string | null;
  can_wake: boolean;
  block_reason: 'DND' | 'COOLDOWN' | null;
  wake_available_at: string | null;
}

export interface WakeGroupDetail {
  id: number;
  name: string;
  invite_code: string;
  capacity: number;
  current_members: number;
  members: WakeGroupMember[];
}

// ===== Wake Request / Proof =====
export type WakeRequestStatus = 'SENT' | 'VERIFIED' | 'NEEDS_HELP';

export interface WakeRequestResponse {
  wake_request_id: number;
  status: WakeRequestStatus;
  requested_at: string;
  self_verify?: boolean;
  pose?: { date: string; description: string };
}

export interface WakeRequestDetail {
  id: number;
  status: WakeRequestStatus;
  sender: { id: number; nickname: string };
  receiver: { id: number; nickname: string };
  requested_at: string;
  pose: { date: string; description: string };
  attempts_used: number;
  remaining_attempts: number;
}

export type PoseMatchResult = 'SUCCESS' | 'FAIL';

export interface ProofResponse {
  wake_request_id: number;
  attempt_no: number;
  pose_match_score: number;
  pose_match_result: PoseMatchResult;
  request_status: WakeRequestStatus;
  can_retry: boolean;
  remaining_attempts: number;
  verified_at?: string;
  cooldown_until?: string;
  proof_expires_at?: string;
}

// ===== Stats =====
export interface StatsResponse {
  success_rate: number;
  avg_gap_minutes: number;
  streak_days: number;
}

// ===== Fixed Schedule =====
export interface FixedSchedule {
  id: number;
  title: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface CreateFixedScheduleRequest {
  title: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
}
