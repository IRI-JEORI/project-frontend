import { Alert, Platform } from 'react-native';
import { tokenStorage } from '../../api/tokenStorage';
import { openWakeNotification } from '../../navigation/rootNavigation';
import { startForegroundMessaging } from '../messaging';

let mockForegroundHandler: ((message: unknown) => Promise<void>) | undefined;
let mockOpenedHandler: ((message: unknown) => Promise<void>) | undefined;
let mockInitialMessage: unknown = null;

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getInitialNotification: jest.fn(() => Promise.resolve(mockInitialMessage)),
  onMessage: jest.fn((_messaging, handler) => {
    mockForegroundHandler = handler;
    return jest.fn();
  }),
  onNotificationOpenedApp: jest.fn((_messaging, handler) => {
    mockOpenedHandler = handler;
    return jest.fn();
  }),
  onTokenRefresh: jest.fn(() => jest.fn()),
  getToken: jest.fn(),
  registerDeviceForRemoteMessages: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('../../navigation/rootNavigation', () => ({
  openWakeNotification: jest.fn(),
}));

const wakeMessage = {
  data: { type: 'WAKE_REQUEST', referenceId: '42' },
  notification: { title: '깨우기', body: '일어나세요' },
};

describe('FCM authenticated navigation guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockForegroundHandler = undefined;
    mockOpenedHandler = undefined;
    mockInitialMessage = null;
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'android',
    });
  });

  it('ignores foreground and opened notifications after logout', async () => {
    jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(null);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    startForegroundMessaging();

    await mockForegroundHandler?.(wakeMessage);
    await mockOpenedHandler?.(wakeMessage);

    expect(alert).not.toHaveBeenCalled();
    expect(openWakeNotification).not.toHaveBeenCalled();
  });

  it('drops a cold-start wake payload without an authenticated session', async () => {
    mockInitialMessage = wakeMessage;
    jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue(null);

    startForegroundMessaging();
    await Promise.resolve();
    await Promise.resolve();

    expect(openWakeNotification).not.toHaveBeenCalled();
  });

  it('keeps opened-notification navigation while logged in', async () => {
    jest.spyOn(tokenStorage, 'getAccessToken').mockResolvedValue('access-token');
    startForegroundMessaging();

    await mockOpenedHandler?.(wakeMessage);

    expect(openWakeNotification).toHaveBeenCalledWith(42);
  });
});
