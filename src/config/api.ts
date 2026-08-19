import { Platform } from 'react-native';

const DEVELOPMENT_API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

// 배포 전에 실제 HTTPS 백엔드 주소로 교체합니다.
const PRODUCTION_API_BASE_URL = 'https://api.nunnun.app';

export const API_BASE_URL = (
  __DEV__ ? DEVELOPMENT_API_BASE_URL : PRODUCTION_API_BASE_URL
).replace(/\/$/, '');

export const API_TIMEOUT_MS = 15_000;
export const UPLOAD_TIMEOUT_MS = 60_000;
