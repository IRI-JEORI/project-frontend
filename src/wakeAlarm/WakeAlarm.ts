import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

type WakeAlarmNativeModule = {
  start(requestId: number): Promise<void>;
  stop(requestId: number): Promise<void>;
  consumePendingNavigationRequestId(): Promise<number | null>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
};

const nativeWakeAlarm = NativeModules.WakeAlarm as WakeAlarmNativeModule | undefined;
const isValidRequestId = (requestId: number) =>
  Number.isSafeInteger(requestId) && requestId > 0;

export const WakeAlarm = {
  async start(requestId: number) {
    if (Platform.OS !== 'android' || !nativeWakeAlarm || !isValidRequestId(requestId)) return;
    await nativeWakeAlarm.start(requestId);
  },
  async stop(requestId: number) {
    if (Platform.OS !== 'android' || !nativeWakeAlarm || !isValidRequestId(requestId)) return;
    await nativeWakeAlarm.stop(requestId);
  },
};

export const listenForWakeAlarmNavigation = (listener: (requestId: number) => void) => {
  if (Platform.OS !== 'android' || !nativeWakeAlarm) return () => undefined;
  const emitter = new NativeEventEmitter(nativeWakeAlarm);
  const subscription = emitter.addListener('WakeAlarmNotificationOpened', (requestId: unknown) => {
    if (typeof requestId === 'number' && isValidRequestId(requestId)) listener(requestId);
  });
  nativeWakeAlarm.consumePendingNavigationRequestId().then(requestId => {
    if (requestId !== null && isValidRequestId(requestId)) listener(requestId);
  }).catch(() => undefined);
  return () => subscription.remove();
};
