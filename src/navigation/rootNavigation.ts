import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

let pendingWakeRequestId: number | null = null;

export const openWakeNotification = (requestId: number) => {
  if (navigationRef.isReady()) {
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
