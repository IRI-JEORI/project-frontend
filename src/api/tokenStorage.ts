import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'nunnun.accessToken';
const REFRESH_TOKEN_KEY = 'nunnun.refreshToken';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
  ]);
};

export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_TOKEN_KEY);

export const clearTokens = () =>
  AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
