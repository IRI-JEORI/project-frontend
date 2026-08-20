import {
  createAuthenticatedNavigationState,
  isSameWakeNotificationRoute,
} from '../rootNavigation';

describe('authenticated navigation state', () => {
  it('removes Login and leaves Home as the only route without a pending request', () => {
    expect(createAuthenticatedNavigationState()).toEqual({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  });

  it('removes Login and places a pending WakeNotification above Home', () => {
    expect(createAuthenticatedNavigationState(42)).toEqual({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'WakeNotification', params: { requestId: 42 } },
      ],
    });
  });
});

describe('wake notification root navigation', () => {
  it('recognizes when the same request is already open', () => {
    expect(
      isSameWakeNotificationRoute(
        { name: 'WakeNotification', params: { requestId: 42 } },
        42,
      ),
    ).toBe(true);
  });

  it('does not suppress a different pending request', () => {
    expect(
      isSameWakeNotificationRoute(
        { name: 'WakeNotification', params: { requestId: 41 } },
        42,
      ),
    ).toBe(false);
  });
});
