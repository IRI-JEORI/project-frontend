import {
  createSelfVerifyCompletionState,
  createWakeProofCompletionState,
} from '../selfVerifyNavigation';

describe('wake proof completion navigation', () => {
  it('leaves Home below WakeGroupDetail after terminal success or failure', () => {
    expect(createWakeProofCompletionState(17)).toEqual({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'WakeGroupDetail', params: { groupId: 17 } },
      ],
    });
  });

  it('falls back to Home when groupId is unavailable', () => {
    expect(createWakeProofCompletionState()).toEqual({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  });
});

describe('self verify completion navigation', () => {
  it('removes verification screens and leaves Home below WakeGroupDetail', () => {
    expect(createSelfVerifyCompletionState(17)).toEqual({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'WakeGroupDetail', params: { groupId: 17 } },
      ],
    });
  });
});
