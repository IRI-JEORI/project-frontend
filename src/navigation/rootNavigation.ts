import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

let pendingWakeRequestId: number | null = null;

export const createAuthenticatedNavigationState = (requestId?: number) => ({
  index: requestId === undefined ? 0 : 1,
  routes: requestId === undefined
    ? [{ name: 'Home' as const }]
    : [
        { name: 'Home' as const },
        { name: 'WakeNotification' as const, params: { requestId } },
      ],
});

export const isSameWakeNotificationRoute = (
  route: { name: string; params?: unknown } | undefined,
  requestId: number,
) =>
  route?.name === 'WakeNotification' &&
  (route.params as { requestId?: number } | undefined)?.requestId === requestId;

export const openWakeNotification = (requestId: number) => {
  if (navigationRef.isReady()) {
    const currentRoute = navigationRef.getCurrentRoute();
    if (isSameWakeNotificationRoute(currentRoute, requestId)) {
      return;
    }
    navigationRef.navigate('WakeNotification', { requestId });
    return;
  }

  pendingWakeRequestId = requestId;
};

export const flushPendingWakeRequestNavigation = () => {
  if (pendingWakeRequestId === null || !navigationRef.isReady()) {
    return;
  }

  const requestId = pendingWakeRequestId;
  pendingWakeRequestId = null;
  navigationRef.navigate('WakeNotification', { requestId });
};

export const clearPendingWakeRequestNavigation = () => {
  pendingWakeRequestId = null;
};
