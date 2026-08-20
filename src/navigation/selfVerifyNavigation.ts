export const createWakeProofCompletionState = (groupId?: number) =>
  groupId === undefined
    ? {
        index: 0,
        routes: [{ name: 'Home' as const }],
      }
    : {
        index: 1,
        routes: [
          { name: 'Home' as const },
          { name: 'WakeGroupDetail' as const, params: { groupId } },
        ],
      };

export const createSelfVerifyCompletionState = (groupId: number) =>
  createWakeProofCompletionState(groupId);
