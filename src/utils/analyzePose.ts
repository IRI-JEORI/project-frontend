export type PoseAnalysisResult = 'success' | 'failure';

// TODO: 실제 배포에서는 이 함수 내부를 AI 분석 API 호출 결과로 교체합니다.
export const getDemoPoseAnalysisResult = (): PoseAnalysisResult =>
  Math.random() < 0.5 ? 'success' : 'failure';
