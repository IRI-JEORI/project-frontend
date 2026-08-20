import { groupCompletionResetState } from '../groupCompletionNavigation';

describe('group completion navigation', () => {
  it('leaves exactly Home below the created or joined WakeGroupDetail', () => {
    expect(groupCompletionResetState(17)).toEqual({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'WakeGroupDetail', params: { groupId: 17 } },
      ],
    });
  });

  it('does not create a duplicate WakeGroupDetail route', () => {
    const state = groupCompletionResetState(29);
    expect(state.routes.filter(route => route.name === 'WakeGroupDetail')).toHaveLength(1);
  });
});
