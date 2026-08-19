/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(() => Promise.resolve('token')),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  onMessage: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  onTokenRefresh: jest.fn(() => jest.fn()),
  registerDeviceForRemoteMessages: jest.fn(() => Promise.resolve()),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => undefined),
  useCameraPermission: jest.fn(() => ({
    hasPermission: false,
    requestPermission: jest.fn(() => Promise.resolve(false)),
  })),
  usePhotoOutput: jest.fn(() => ({
    capturePhotoToFile: jest.fn(() => Promise.resolve()),
  })),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
