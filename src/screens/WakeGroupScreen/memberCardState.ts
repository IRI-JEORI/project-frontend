import type { WakeGroupMember } from '../../api/types';

export const memberCardStatus = (member: WakeGroupMember) =>
  member.state === 'AWAKE'
    ? ('done' as const)
    : member.state === 'NEEDS_HELP'
      ? ('needsHelp' as const)
      : !member.is_me && member.block_reason === 'DND'
        ? ('dnd' as const)
      : ('pending' as const);

export const dndActionLabel = (wakeAvailableAt: string | null) => {
  if (!wakeAvailableAt) return '방해금지';

  const time = wakeAvailableAt.match(/T(\d{2}):(\d{2})/)?.slice(1).join(':');
  return time ? `${time} 이후 깨우기 가능` : '방해금지';
};

export const memberActionLabel = (member: WakeGroupMember) =>
  member.is_me
    ? '셀프 인증'
    : member.can_wake
      ? '깨우기'
      : member.block_reason === 'DND'
        ? dndActionLabel(member.wake_available_at)
        : '대기 중';

export const canOpenWakeConfirmation = (member: WakeGroupMember) =>
  !member.is_me &&
  member.state !== 'AWAKE' &&
  member.can_wake &&
  member.block_reason === null;
