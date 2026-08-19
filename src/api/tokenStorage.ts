import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthTokens } from './types';

const ACCESS_TOKEN_KEY = '@nunnun/auth/access-token';
const REFRESH_TOKEN_KEY = '@nunnun/auth/refresh-token';

export const tokenStorage = {
  getAccessToken: () => AsyncStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => AsyncStorage.getItem(REFRESH_TOKEN_KEY),

  save: ({ access_token, refresh_token }: AuthTokens) =>
    Promise.all([
      AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token),
    ]),

  clear: () =>
    Promise.all([
      AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    ]),
};
