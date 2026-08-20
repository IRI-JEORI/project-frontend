import { ApiError } from '../api';

export const proofErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '인증사진을 전송하지 못했어요. 다시 시도해주세요.';
  }

  if (error.status === 401) return '데모 사용자를 다시 선택해주세요.';
  if (error.status === 403) return '이 깨우기 요청에 인증사진을 제출할 권한이 없어요.';
  if (error.status === 404) return '깨우기 요청을 찾을 수 없어요.';
  if (
    error.code === 'INVALID_WAKE_PROOF_IMAGE' ||
    error.status === 400 ||
    error.status === 413
  ) {
    return 'JPEG, PNG, WebP 형식의 10MB 이하 사진을 사용해주세요.';
  }
  if (error.code === 'RETRY_EXHAUSTED') return '인증 시도 횟수를 모두 사용했어요.';
  if (error.code === 'INVALID_WAKE_REQUEST_STATUS') {
    return '이미 완료되었거나 인증할 수 없는 깨우기 요청이에요.';
  }
  if (error.code === 'POSE_ANALYSIS_FAILED') {
    return 'AI 포즈 분석에 실패했어요. 잠시 후 다시 시도해주세요.';
  }
  if (error.code === 'WAKE_PROOF_UPLOAD_FAILED') {
    return '인증사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요.';
  }

  return '인증사진을 전송하지 못했어요. 다시 시도해주세요.';
};
