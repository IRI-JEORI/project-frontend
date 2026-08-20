import type { CommonActions } from '@react-navigation/native';

export const groupCompletionResetState = (groupId: number) => ({
  index: 1,
  routes: [
    { name: 'Home' as const },
    { name: 'WakeGroupDetail' as const, params: { groupId } },
  ],
}) satisfies Parameters<typeof CommonActions.reset>[0];
